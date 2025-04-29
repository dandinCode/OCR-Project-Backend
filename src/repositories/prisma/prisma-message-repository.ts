import { PrismaService } from "src/database/prisma.service";
import { Injectable } from "@nestjs/common";
import { MessageRepository } from "../message-repository";

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
    constructor(private prisma: PrismaService) {}

    async create(userId: string, chatId: string, text: string, owner: string): Promise<{ id: string }> {
        const message = await this.prisma.message.create({
          data: {
            userId,
            chatId,
            text,
            owner,
          },
          select: {
            id: true, 
          },
        });
    
        return message;
  }

  async findAllByChatId(chatId: string): Promise<
      { id: string; text: string; owner: string }[]
    > {
      return this.prisma.message.findMany({
        where: { chatId },
      });
    }
}
