import { Decimal } from "@prisma/client/runtime/library";

export abstract class PlansRepository {
    abstract create(name: string, tokens: number, price: Decimal, themeColor: string, paymentLinks: string): Promise<{ id: number }>;
    
    abstract findById(id: number): Promise<{ id: number; name: string; tokens: number, price: Decimal, themeColor: string, paymentLinks: string} | null>;

    abstract findByName(name: string): Promise<{ id: number; name: string; tokens: number, price: Decimal, themeColor: string, paymentLinks: string} | null>;

    abstract getAllPlans(): Promise<{ id: number; name: string; tokens: number; price: Decimal, themeColor: string, paymentLinks: string}[]> ;
  }