import { Module } from '@nestjs/common';
import { OpenAIService } from '../services/chatgpt.service';
import { OpenAIController } from '../controllers/chatgpt.controller';
import { MessageRepository } from '../repositories/message-repository';
import { PrismaMessageRepository } from '../repositories/prisma/prisma-message-repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [OpenAIController],
  providers: [PrismaService, OpenAIService, {
      provide: MessageRepository,
      useClass: PrismaMessageRepository,
    }],
})
export class ChatGptModule {}
