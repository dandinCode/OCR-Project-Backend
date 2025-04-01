import { Module } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { WebhookController } from '../controllers/webhook.controller';
import { WebhookService } from '@/services/webhook.service';
import { StripeController } from '@/controllers/stripe.controller';
import { UserRepository } from '@/repositories/user-repository';
import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [StripeController, WebhookController],
  providers: [StripeService, 
    WebhookService, 
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    }
  ],
})
export class StripeModule {}
