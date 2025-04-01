import { Controller, Post, Req, Headers, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { WebhookService } from '../services/webhook.service';
import { Stripe } from 'stripe';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post()
  async handleStripeWebhook(@Req() req: Request, @Headers('stripe-signature') signature: string) {
    if (!req.rawBody) {
      throw new BadRequestException('Missing rawBody');
    }

    try {
      const rawBodyString = req.rawBody.toString();
      const event: Stripe.Event = await this.webhookService.constructEvent(rawBodyString, signature);
      await this.webhookService.processEvent(event);
      return { received: true };
    } catch (error) {
      throw new BadRequestException('Webhook error: ' + error.message);
    }
  }
}

