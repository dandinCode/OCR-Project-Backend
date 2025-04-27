import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from '../database/prisma.service';
import { ChatRepository } from '@/repositories/chat-repository';
import { PrismaChatRepository } from '@/repositories/prisma/prisma-chat-repository';
import { ChatController } from '@/controllers/chatController';

@Module({
  controllers: [ChatController],
  providers: [PrismaService, {
    provide: ChatRepository,
    useClass: PrismaChatRepository,
  }],
})
export class ChatModule {}
