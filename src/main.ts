import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONT_URL,  
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Adiciona suporte para `rawBody`, necessário para a validação da assinatura do webhook da Stripe
  app.use(
    '/webhook/', // Aplica apenas na rota de webhook
    express.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf; 
      },
    })
  );

  await app.listen(5000);
}
bootstrap();
