import { Controller, Get } from '@nestjs/common';
import { PlansService } from '../services/plans.service';
import { Decimal } from '@prisma/client/runtime/library';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async getAllPlans(): Promise<{ id: number; name: string; tokens: number; price: Decimal }[]> {
    return this.plansService.getAllPlans();
  }
}