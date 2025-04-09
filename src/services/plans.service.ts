import { Injectable } from '@nestjs/common';
import { PlansRepository } from '../repositories/plans-repository';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PlansService {
  constructor(private readonly plansRepository: PlansRepository) {}

  async getAllPlans(): Promise<{ id: number; name: string; tokens: number; price: Decimal }[]> {
    return this.plansRepository.getAllPlans();
  }
}