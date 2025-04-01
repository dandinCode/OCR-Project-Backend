import { PrismaService } from '../database/prisma.service';
import { PlansRepository } from '../repositories/plans-repository';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library'; 
import 'dotenv/config';

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly plansRepository: PlansRepository,
  ) {}

    async seedPlans() {
    const plans = [
      { name: 'Gratuito', tokens: 10000, price: new Decimal(0), themeColor: "stone", paymentLinks: process.env.FRONT_URL+"/home"},
      { name: 'Pré-pago', tokens: 200000, price: new Decimal(9.90), themeColor: "slate", paymentLinks: process.env.PAYMENT_LINK_PREPAGO },
      { name: 'Bronze', tokens: 500000, price: new Decimal(14.90), themeColor: "amber", paymentLinks: process.env.PAYMENT_LINK_BRONZE },
      { name: 'Prata', tokens: 3000000, price: new Decimal(29.90), themeColor: "gray", paymentLinks: process.env.PAYMENT_LINK_PRATA },
      { name: 'Ouro', tokens: 10000000, price: new Decimal(99.90), themeColor: "yellow", paymentLinks: process.env.PAYMENT_LINK_OURO },
    ];
  
    for (const plan of plans) {
      const existingPlan = await this.plansRepository.findByName(plan.name);
  
      if (!existingPlan) {
        await this.plansRepository.create(plan.name, plan.tokens, plan.price, plan.themeColor, plan.paymentLinks);  
        console.log(`Plano "${plan.name}" criado com sucesso.`);
      } else {
        console.log(`Plano "${plan.name}" já existe.`);
      }
    }
  }
  
}
