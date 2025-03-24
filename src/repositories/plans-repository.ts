import { Decimal } from "@prisma/client/runtime/library";

export abstract class PlansRepository {
    abstract create(name: string, tokens: number, price: Decimal): Promise<{ id: number }>;
    
    abstract findById(id: number): Promise<{ id: number; name: string; tokens: number, price: Decimal} | null>;

    abstract findByName(name: string): Promise<{ id: number; name: string; tokens: number, price: Decimal} | null>;
  }