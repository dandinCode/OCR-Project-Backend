export abstract class UserRepository {
    abstract create(email: string, password: string): Promise<{ id: string }>;
    
    abstract findById(id: string): Promise<{ id: string; email: string; maxTokens: number} | null>;

    abstract updateMaxTokens(id: string, maxTokens: number): Promise<{ id: string } | null>;
  }