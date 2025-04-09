import { PrismaService } from '../database/prisma.service';
import { PrismaPlansRepository } from '../repositories/prisma/prisma-plans-repository';
import { SeedService } from '@/services/seed.service';

async function runSeed() {
    // Criar instâncias manualmente
    const prismaService = new PrismaService();
    await prismaService.onModuleInit(); // Conecta ao banco de dados
    
    const plansRepository = new PrismaPlansRepository(prismaService);
    const seedService = new SeedService(prismaService, plansRepository);

    try {
        await seedService.seedPlans();
        console.log('Seeding completed successfully!');
    } catch (error) {
        console.error('Error while seeding:', error);
    } finally {
        await prismaService.$disconnect();
        process.exit(0);
    }
}

runSeed();