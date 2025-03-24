import { PrismaService } from '../database/prisma.service';
import { PlansRepository } from '../repositories/plans-repository';
import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library'; 

@Injectable()
export class SeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly plansRepository: PlansRepository,
  ) {}

    async seedPlans() {
    const plans = [
      { name: 'Free', tokens: 10000, price: new Decimal(0) },
      { name: 'Prepaid', tokens: 200000, price: new Decimal(9.90) },
      { name: 'Bronze Plan', tokens: 500000, price: new Decimal(14.90) },
      { name: 'Silver Plan', tokens: 3000000, price: new Decimal(29.90) },
      { name: 'Gold Plan', tokens: 10000000, price: new Decimal(99.90) },
    ];
  
    for (const plan of plans) {
      // Verifica se o plano já existe no banco de dados
      const existingPlan = await this.plansRepository.findByName(plan.name);
  
      if (!existingPlan) {
        // Se o plano não existir, cria um novo
        await this.plansRepository.create(plan.name, plan.tokens, plan.price);  // Passa o objeto diretamente
        console.log(`Plano "${plan.name}" criado com sucesso.`);
      } else {
        console.log(`Plano "${plan.name}" já existe.`);
      }
    }
  }
  
}
