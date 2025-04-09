import { UserRepository } from '@/repositories/user-repository';
import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private userRepository: UserRepository) {
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
      
      if(!session.client_reference_id || !session.metadata?.tokens || !session.metadata?.productName || !session.customer) {
        throw new Error("Dados não encontrados");
      }

      const planExpiration = new Date();
      planExpiration.setMonth(planExpiration.getMonth() + 1);

      await this.userRepository.updateUserPlan(session.client_reference_id, Number(session.metadata?.tokens),  planExpiration, session.metadata?.productName, String(session.customer))

      return {
        userId: session.client_reference_id,
        productName: session.metadata?.productName,
      };
    } catch (error) {
      throw new Error("Erro ao verificar pagamento: " + error.message);
    }
  }

}
