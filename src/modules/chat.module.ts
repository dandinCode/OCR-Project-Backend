import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from '../database/prisma.service';
import { ChatRepository } from '@/repositories/chat-repository';
import { PrismaChatRepository } from '@/repositories/prisma/prisma-chat-repository';
import { ChatController } from '@/controllers/chatController';
import { DocumentRepository } from '@/repositories/document-repository';
import { PrismaDocumentRepository } from '@/repositories/prisma/prisma-document-repository';

@Module({
  controllers: [ChatController],
  providers: [PrismaService, {
    provide: ChatRepository,
    useClass: PrismaChatRepository,
  }, {
    provide: DocumentRepository,
    useClass: PrismaDocumentRepository,
  }],
})
export class ChatModule {}
