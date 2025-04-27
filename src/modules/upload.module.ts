import { Module } from '@nestjs/common';
import { UploadController } from '../controllers/upload.controller';
import { OcrService } from '../services/ocr.service';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from '../database/prisma.service';
import { DocumentRepository } from '../repositories/document-repository';
import { PrismaDocumentRepository } from '../repositories/prisma/prisma-document-repository';
import { MessageRepository } from '../repositories/message-repository';
import { PrismaMessageRepository } from '../repositories/prisma/prisma-message-repository';
import { ChatRepository } from '@/repositories/chat-repository';
import { PrismaChatRepository } from '@/repositories/prisma/prisma-chat-repository';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UploadController],
  providers: [OcrService, PrismaService, {
    provide: DocumentRepository,
    useClass: PrismaDocumentRepository,
  }, {
    provide: MessageRepository,
    useClass: PrismaMessageRepository,
  }, {
    provide: ChatRepository,
    useClass: PrismaChatRepository,
  }],
})
export class UploadModule {}
