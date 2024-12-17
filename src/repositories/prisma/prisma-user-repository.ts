import { PrismaService } from "src/database/prisma.service";
import { UserRepository } from "../user-repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private prisma: PrismaService) {}

    async create(email: string, password: string): Promise<{ id: string }> {
        const user = await this.prisma.user.create({
          data: {
            email,
            password,
          } as any,
          select: {
            id: true, 
          },
        });
    
        return user;
      }

    async findById(id: string): Promise<{ id: string; email: string} | null> {
      return this.prisma.user.findUnique({
        where: { id },
      });
    }
}
