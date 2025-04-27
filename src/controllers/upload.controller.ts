import { Controller, Post, Get, Query, Param, UseInterceptors, Body, Res, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OcrService } from '../services/ocr.service';
import { DocumentRepository } from '../repositories/document-repository';
const PDFDocument = require('pdfkit');
import { Response } from 'express';
import { MessageRepository } from '../repositories/message-repository';
import { ChatRepository } from '@/repositories/chat-repository';
const fs = require('fs');

@Controller('upload')
export class UploadController {
    constructor(
        private readonly ocrService: OcrService, 
        private documentRepository : DocumentRepository,
        private messageRepository : MessageRepository,
        private chatRepository: ChatRepository
    ) {}

    @Post('image')
    @UseInterceptors(FilesInterceptor('file')) 
    async handleFileUpload(
      @UploadedFiles() files: Express.Multer.File[],
      @Body() body: { userId: string }
    ) {
      const { userId } = body;
  
      try {
        const chat = await this.chatRepository.create(files[0].originalname, userId);
  
        for (const file of files) {
          console.log('\nArquivo recebido:', file);
  
          const extractedText = await this.ocrService.extractText(file.path);
          await this.documentRepository.create(
            userId,
            file.path,
            extractedText,
            file.originalname,
            chat.id,
          );
        }

        const response = { success: true, chatId: chat.id};
  
        return response;
      } catch (error) {
        console.error("Erro ao processar o arquivo:", error); 
        return { success: false, error: error.message };
      }
    }

    @Get('image/:id')
    async getDocumentData(@Param('id') id: string) {
        try {
            const document = await this.documentRepository.findById(id);

            if (!document) {
                return { success: false, error: "Document not found" };
            }

            return document;
        } catch (error) {
            console.error('Error fetching document:', error);
            return { success: false, error: error.message };
        }
    }

    @Get('byChatId/:chatId')
    async getDocumentsByChatId(@Param('chatId') chatId: string) {
        try{
            if (!chatId) {
                return { error: 'Chat ID is required' };
            }
            
            const documents = await this.documentRepository.findAllByChatId(chatId);

            return { "success": true, documents};
        } catch (error) {
            console.error('Error fetching document:', error);
            return { success: false, error: error.message };
        }
    }

    @Get('list')
    async listDocuments(@Query('userId') userId: string) {
        try{
            if (!userId) {
                throw new Error('User ID is required');
            }
    
            const documents = await this.documentRepository.findAllByUserId(userId);
            const uniqueDocumentsMap = new Map();

            for (const doc of documents) {
            if (!uniqueDocumentsMap.has(doc.chatId)) {
                uniqueDocumentsMap.set(doc.chatId, doc);
            }
            }

            const result = Array.from(uniqueDocumentsMap.values());

            return { "success": true, result};
        } catch (error) {
            console.error('Error fetching document:', error);
            return { success: false, error: error.message };
        }
        
    }

    @Get('download/:chatId')
    async downloadDocument(@Param('chatId') chatId: string, @Res() res: Response) {
        const documents = await this.documentRepository.findAllByChatId(chatId);

        if (!documents || documents.length === 0) {
            return res.status(404).json({ error: "Document not found" });
        }

        const pdf = new PDFDocument();

        res.setHeader('Content-Disposition', `attachment; filename="document.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        pdf.pipe(res);

        for (const document of documents) {
            pdf.fontSize(16).text(`Imagem: ${document.name || 'Sem nome'}`);

            if (fs.existsSync(document.filePath)) {
            pdf.image(document.filePath, { fit: [250, 300], align: 'center', valign: 'center' });
            pdf.moveDown(15);
            }

            pdf.fontSize(14).text("Dados extraído:", { underline: true });
            pdf.fontSize(9).text(document.extractedText || "Sem texto extraído.", {
                width: 1500, // limite horizontal
                ellipsis: true,
              });
            pdf.addPage();
        }

        pdf.fontSize(16).text('Interações com o LLM:', { underline: true });
        pdf.moveDown();

        const messages = await this.messageRepository.findAllByChatId(chatId);

        messages.forEach((msg) => {
            if (msg.owner === "user") {
            pdf.font('Helvetica-Bold').fontSize(14).text('Usuário: ', { continued: true });
            pdf.font('Helvetica').text(msg.text);
            } else {
            pdf.font('Helvetica-Bold').fontSize(14).text('Resposta: ', { continued: true });
            pdf.font('Helvetica').text(msg.text);
            }
            pdf.moveDown();
        });

        pdf.end();
    }

}