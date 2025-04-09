import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { PrismaService } from '../database/prisma.service';
import { UploadModule } from './upload.module';
import { ChatGptModule } from './chatgpt.module';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '../repositories/user-repository';
import { PrismaUserRepository } from '../repositories/prisma/prisma-user-repository';
import { AuthModule } from '../auth/auth.module';
import { PlansModule } from './plans.module';
import { StripeModule } from './stripe.module';

@Module({
  imports: [
    AuthModule, 
    UploadModule, 
    ConfigModule.forRoot({ isGlobal: true }),
    ChatGptModule,
    AuthModule,
    PlansModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [PrismaService, {
    provide: UserRepository,
    useClass: PrismaUserRepository,
  }],
})
export class AppModule  {}