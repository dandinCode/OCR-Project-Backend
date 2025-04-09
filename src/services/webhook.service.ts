import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';
import { StripeService } from './stripe.service';
import { UserRepository } from '@/repositories/user-repository';
import { PlansRepository } from '@/repositories/plans-repository';

@Injectable()
export class WebhookService {
  constructor(private readonly stripeService: StripeService,  private userRepository: UserRepository, private plansRepository: PlansRepository) {}

  async constructEvent(rawBody: string, signature: string): Promise<Stripe.Event> {
    return this.stripeService.constructEvent(rawBody, signature);
  }

  async processEvent(event: Stripe.Event): Promise<void> {
    try{
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const customerId = paymentIntent.customer;

        const user = await this.userRepository.findByStripeCustomerId(String(customerId));        
        if (!user){
          console.log("Primeiro pagamento!");
        } else{
          const planExpiration = new Date();
          planExpiration.setMonth(planExpiration.getMonth() + 1);

          const userPlan = await this.plansRepository.findByName(user.chosenPlan);
          
          if(Number(event.data.object.amount)/100 == Number(userPlan.price)){
            await this.userRepository.updateUserPlan(user.id, userPlan.tokens, planExpiration, user.chosenPlan,  String(customerId));
          } else{
            throw new Error("O valor recebido é diferente do valor da mensalidade");
          }
        }
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
