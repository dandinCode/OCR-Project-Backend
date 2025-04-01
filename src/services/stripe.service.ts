import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe( process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia", 
    });
  }

  async constructEvent(payload: any, signature: string): Promise<Stripe.Event> {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      return event;
    } catch (err) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }
  }
  
  async verifyPayment(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);

      if (!session) {
        throw new Error("Sessão de pagamento não encontrada");
      }

      return {
        userId: session.client_reference_id,
        productName: session.metadata?.productName || "Desconhecido",
        status: session.payment_status,
      };
    } catch (error) {
      throw new Error("Erro ao verificar pagamento: " + error.message);
    }
  }
}
