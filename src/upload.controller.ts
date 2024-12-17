import { Controller, Post, Get, Query, Param, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import { DocumentRepository } from './repositories/document-repository';
import { request } from 'http';

@Controller('upload')
export class UploadController {
    constructor(
        private readonly ocrService: OcrService, 
        private documentRepository : DocumentRepository
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
}