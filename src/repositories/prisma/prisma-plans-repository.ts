import { PrismaService } from "src/database/prisma.service";
import { PlansRepository } from "../plans-repository";
import { Injectable } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaPlansRepository implements PlansRepository {
    constructor(private prisma: PrismaService) {}

    async create(name: string, tokens: number, price: Decimal, themeColor: string): Promise<{ id: number }> {
        const plans = await this.prisma.plans.create({
          data: {
            name,
            tokens,
            price,
            themeColor,
          } as any,
          select: {
            id: true, 
          },
        });
    
        return plans;
      }

    async findById(id: number): Promise<{ id: number; name: string; tokens: number, price: Decimal, themeColor: string} | null> {
      return this.prisma.plans.findUnique({
        where: { id },
      });
    }

    async findByName(name: string): Promise<{ id: number; name: string; tokens: number, price: Decimal, themeColor: string} | null> {
        return this.prisma.plans.findFirst({
          where: { name },
        });
    }

    async getAllPlans(): Promise<{ id: number; name: string; tokens: number; price: Decimal, themeColor: string; }[]> {
      return this.prisma.plans.findMany({
        select: {
          id: true,
          name: true,
          tokens: true,
          price: true, 
          themeColor: true
        },
        orderBy: {
          price: 'desc'
        }
      });
    }
}
