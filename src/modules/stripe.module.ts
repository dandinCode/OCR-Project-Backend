import { Module } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';
import { WebhookController } from '../controllers/webhook.controller';
import { WebhookService } from '@/services/webhook.service';
import { StripeController } from '@/controllers/stripe.controller';

@Module({
  imports: [],
  controllers: [StripeController, WebhookController],
  providers: [StripeService, WebhookService],
})
export class StripeModule {}
