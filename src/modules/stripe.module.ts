import { Module } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { WebhookController } from '../controllers/webhook.controller';
import { WebhookService } from '@/services/webhook.service';
import { StripeController } from '@/controllers/stripe.controller';
import { UserRepository } from '@/repositories/user-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { PrismaService } from '../database/prisma.service';
import { PlansRepository } from '@/repositories/plans-repository';
import { PrismaPlansRepository } from '@/repositories/prisma/prisma-plans-repository';

@Module({
  controllers: [StripeController, WebhookController],
  providers: [StripeService, 
    WebhookService, 
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: PlansRepository,
      useClass: PrismaPlansRepository,
    },
  ],
})
export class StripeModule {}
