import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { StripeService } from './stripe.service';
import { UserRepository } from '@/repositories/user-repository';

@Injectable()
export class WebhookService {
  constructor(private readonly stripeService: StripeService,  private userRepository: UserRepository) {}

  async constructEvent(rawBody: string, signature: string): Promise<Stripe.Event> {
    return this.stripeService.constructEvent(rawBody, signature);
  }

  async processEvent(event: Stripe.Event): Promise<void> {
    try{
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Pagamento confirmado para:`, paymentIntent);
      }
      else if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer;
        
        const user = await this.userRepository.findByStripeCustomerId(String(customerId))
        if (!user){
          throw new Error("Cliente não encontrado");
        }
        await this.userRepository.updateUserPlan(user.id, user.maxTokens, user.planExpiration, "Gratuito",  String(customerId));
        console.log(`Assinatura cancelada:`, subscription);
      }
    } catch(error){
      console.error(error.message)
    }    
  }

}
