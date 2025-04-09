export abstract class UserRepository {
    abstract create(email: string, password: string): Promise<{ id: string }>;
    
    abstract findById(id: string): Promise<{ id: string; email: string; maxTokens: number; planExpiration: Date; chosenPlan: string, stripeCustomerId: string} | null>;

    abstract updateMaxTokens(id: string, maxTokens: number): Promise<{ id: string } | null>;

    abstract updateUserPlan(id: string, maxTokens: number, planExpiration: Date, chosenPlan: string, stripeCustomerId: string): Promise<{ id: string } | null>;

    abstract findByStripeCustomerId(stripeCustomerId: string): Promise<{ id: string; email: string; maxTokens: number; planExpiration: Date; chosenPlan: string, stripeCustomerId: string} | null>;
  }