import { Module } from '@nestjs/common';
import { PlansController } from '../controllers/plans.controller';
import { PlansService } from '../services/plans.service';
import { PrismaService } from '../database/prisma.service';
import { PlansRepository } from '../repositories/plans-repository';
import { PrismaPlansRepository } from '../repositories/prisma/prisma-plans-repository';

@Module({
  controllers: [PlansController],
  providers: [
    PlansService,
    PrismaService,
    {
      provide: PlansRepository,
      useClass: PrismaPlansRepository,
    },
  ],
  exports: [PlansService], // Exporte se outros módulos precisarem usar
})
export class PlansModule {}