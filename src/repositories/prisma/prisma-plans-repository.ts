import { PrismaService } from "src/database/prisma.service";
import { PlansRepository } from "../plans-repository";
import { Injectable } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaPlansRepository implements PlansRepository {
    constructor(private prisma: PrismaService) {}

    async create(name: string, tokens: number, price: Decimal): Promise<{ id: number }> {
        const plans = await this.prisma.plans.create({
          data: {
            name,
            tokens,
            price,
          } as any,
          select: {
            id: true, 
          },
        });
    
        return plans;
      }

    async findById(id: number): Promise<{ id: number; name: string; tokens: number, price: Decimal} | null> {
      return this.prisma.plans.findUnique({
        where: { id },
      });
    }

    async findByName(name: string): Promise<{ id: number; name: string; tokens: number, price: Decimal} | null> {
        return this.prisma.plans.findFirst({
          where: { name },
        });
    }
}
