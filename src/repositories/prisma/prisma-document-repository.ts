import { PrismaService } from "src/database/prisma.service";
import { DocumentRepository } from "../document-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaDocumentRepository implements DocumentRepository {
    constructor(private prisma: PrismaService) {}

    async create(
      userId: string,
      filePath: string,
      extractedText: string,
      name: string,
      chatId: string,
    ) {
      const document = await this.prisma.document.create({
        data: {
          filePath,
          userId,
          extractedText,
          name,
          chatId,
        },
      });
    
      return document;
    }

    async findById(id: string): Promise<{ id: string; filePath: string; extractedText: string, name: string} | null> {
      return this.prisma.document.findUnique({
        where: { id },
      });
    }

    async findAllByUserId(userId: string): Promise<
      { id: string; filePath: string; extractedText: string; name: string; chatId: string }[]
    > {
      return this.prisma.document.findMany({
        where: { userId },
      });
    }

    async findAllByChatId(chatId: string): Promise<
      { id: string; filePath: string; extractedText: string; name: string }[]
    > {
      return this.prisma.document.findMany({
        where: { chatId },
      });
    }

}
