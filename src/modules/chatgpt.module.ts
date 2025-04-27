import { Module } from '@nestjs/common';
import { OpenAIService } from '../services/chatgpt.service';
import { OpenAIController } from '../controllers/chatgpt.controller';
import { MessageRepository } from '../repositories/message-repository';
import { UserRepository } from '../repositories/user-repository';
import { PrismaMessageRepository } from '../repositories/prisma/prisma-message-repository';
import { PrismaUserRepository } from 'src/repositories/prisma/prisma-user-repository';
import { PrismaService } from '../database/prisma.service';
import { DocumentRepository } from '@/repositories/document-repository';
import { PrismaDocumentRepository } from '@/repositories/prisma/prisma-document-repository';
import { ChatRepository } from '@/repositories/chat-repository';
import { PrismaChatRepository } from '@/repositories/prisma/prisma-chat-repository';

@Module({
  controllers: [OpenAIController],
  providers: [PrismaService, OpenAIService, {
      provide: MessageRepository,
      useClass: PrismaMessageRepository,
    },  {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },  {
      provide: DocumentRepository,
      useClass: PrismaDocumentRepository,
    },  {
      provide: ChatRepository,
      useClass: PrismaChatRepository,
    }],
})
export class ChatGptModule {}
