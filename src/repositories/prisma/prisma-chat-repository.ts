import { PrismaService } from "src/database/prisma.service";
import { ChatRepository } from "../chat-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaChatRepository implements ChatRepository {
    constructor(private prisma: PrismaService) {}

      async create(name: string, userId: string): Promise<{ id: string, name: string; createdAt: Date }> {
          const chat = await this.prisma.chat.create({
            data: {
              name,
              userId,
            } as any,
            select: {
              id: true,
              name: true,
              createdAt: true, 
            },
          });
      
          return chat;
      }

      async findById(id: string): Promise<{ id: string; name: string; createdAt: Date} | null> {
        return this.prisma.chat.findUnique({
          where: { id },
        });
      }

      async updateName(id: string, name: string): Promise<void> {
          await this.prisma.chat.update({
              where: { id }, 
              data: { name, accessed: new Date() }
            });
      }

      async findAllByUserId(userId: string): Promise<
        { id: string; name: string; createdAt: Date; accessed: Date }[]
      > {
        return this.prisma.chat.findMany({
          where: { userId },
        });
      }

      async updateAccessed(id: string): Promise<void> {
        await this.prisma.chat.update({
          where: { id },
          data: { accessed: new Date() },
        });
      }

      async delete(id: string): Promise<void> {
        await this.prisma.message.deleteMany({
          where: { chatId: id },
        });
      
        await this.prisma.document.deleteMany({
          where: { chatId: id },
        });
      
        await this.prisma.chat.delete({
          where: { id },
        });
      }

}
