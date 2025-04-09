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
  const rawBodyBuffer = (req: any, res: any, buf: Buffer) => {
    req.rawBody = buf;
  };

  app.use('/webhook', express.json({ verify: rawBodyBuffer })); // Aplica apenas na rota de webhook

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
