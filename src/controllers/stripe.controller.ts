import { Controller, Post, Body, Get, BadRequestException, Query } from '@nestjs/common';
import { StripeService } from '../services/stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get("verify-payment")
  async verifyPayment(@Query("session_id") sessionId: string) {
    if (!sessionId) {
      throw new BadRequestException("ID da sessão é obrigatório");
    }

    return this.stripeService.verifyPayment(sessionId);
  }
}
