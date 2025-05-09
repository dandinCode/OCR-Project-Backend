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

      async findById(id: string): Promise<{ id: string; email: string; maxTokens: number; planExpiration: Date; chosenPlan: string; stripeCustomerId: string } | null> {
        return this.prisma.user.findUnique({
          where: { id },
          select: {  
            id: true,
            email: true,
            maxTokens: true,
            planExpiration: true,
            chosenPlan: true,
            stripeCustomerId: true,
          },
        });
      }

    async updateMaxTokens(id: string, maxTokens: number): Promise<{ id: string } | null> {
      const user = await this.prisma.user.update({
        where: { id }, 
        data: { maxTokens },  
        select: { id: true },  
      });
      return user;
    }

    async updateUserPlan(id: string, maxTokens: number, planExpiration: Date, chosenPlan: string, stripeCustomerId: string): Promise<{ id: string } | null> {
      const user = await this.prisma.user.update({
        where: { id }, 
        data: { maxTokens, planExpiration, chosenPlan, stripeCustomerId },  
        select: { id: true },  
      });
      return user;
    }

    async findByStripeCustomerId(stripeCustomerId: string): Promise<{ id: string; email: string; maxTokens: number; planExpiration: Date; chosenPlan: string; stripeCustomerId: string } | null> {
      return this.prisma.user.findUnique({
        where: { stripeCustomerId },
        select: {  
          id: true,
          email: true,
          maxTokens: true,
          planExpiration: true,
          chosenPlan: true,
          stripeCustomerId: true,
        },
      });
    }
  }
