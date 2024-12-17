import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { OcrService } from './ocr.service';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from './database/prisma.service';
import { DocumentRepository } from './repositories/document-repository';
import { PrismaDocumentRepository } from './repositories/prisma/prisma-document-repository';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [UploadController],
  providers: [OcrService, PrismaService, {
    provide: DocumentRepository,
    useClass: PrismaDocumentRepository,
  }],
})
export class UploadModule {}
