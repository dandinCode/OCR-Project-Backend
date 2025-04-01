import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { StripeService } from './stripe.service';

@Injectable()
export class WebhookService {
  constructor(private readonly stripeService: StripeService) {}

  async constructEvent(rawBody: string, signature: string): Promise<Stripe.Event> {
    return this.stripeService.constructEvent(rawBody, signature);
  }

  async processEvent(event: Stripe.Event): Promise<void> {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`Pagamento confirmado para:`, paymentIntent);
    }
  }
}
