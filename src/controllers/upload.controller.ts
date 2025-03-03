import { Controller, Post, Get, Query, Param, UseInterceptors, UploadedFile, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from '../services/ocr.service';
import { DocumentRepository } from '../repositories/document-repository';
const PDFDocument = require('pdfkit');
import { Response } from 'express';
import { MessageRepository } from '../repositories/message-repository';
const fs = require('fs');

@Controller('upload')
export class UploadController {
    constructor(
        private readonly ocrService: OcrService, 
        private documentRepository : DocumentRepository,
        private messageRepository : MessageRepository
    ) {}

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async handleFileUpload(@UploadedFile() file: Express.Multer.File, @Body() body: { userId: string }) {
        const { userId } = body;
        console.log("\n Arquivo recebido:", file); 
        try {
            const extractedText = await this.ocrService.extractText(file.path);

            const document = await this.documentRepository.create(userId, file.path,  extractedText, file.originalname);

            return { success: true, text: extractedText, documentId: document.id  };
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

    @Get('list')
    async listDocuments(@Query('userId') userId: string) {
        try{
            if (!userId) {
                return { error: 'User ID is required' };
            }
    
            const documents = await this.documentRepository.findAllByUserId(userId);
            return documents;
        } catch (error) {
            console.error('Error fetching document:', error);
            return { success: false, error: error.message };
        }
        
    }

    @Get('download/:documentId')
    async downloadDocument(@Param('documentId') documentId: string, @Res() res: Response) {
        const document = await this.documentRepository.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }
    
        const doc = new PDFDocument();
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="document.pdf"`,
        );
        res.setHeader('Content-Type', 'application/pdf');
    
        doc.pipe(res);
        
        if (fs.existsSync(document.filePath)){
            doc.image(document.filePath, { fit: [250, 300], align: 'center', valign: 'center' });
            doc.moveDown(25);
        }

        doc.fontSize(16).text('Dados Extraídos:', { underline: true });
        doc.fontSize(14).text(document.extractedText);
    
        doc.moveDown();
        doc.fontSize(16).text('Interações com o LLM:', { lineGap: 4, underline: true });
    
        const messages = await this.messageRepository.findAllByDocumentId(documentId);
        messages.forEach((msg) => {
            if (msg.owner === "user") {
                doc.font('Helvetica-Bold').fontSize(14).text('Usuário: ', { continued: true });
                doc.font('Helvetica').text(msg.text);
            } else {
                doc.font('Helvetica-Bold').fontSize(14).text('Resposta: ', { continued: true })
                doc.font('Helvetica').text(msg.text);
            }
        });
    
        doc.end();
    }    
}