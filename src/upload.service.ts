import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class UploadService {
  async analyzeFile(file: Express.Multer.File) {
    const metadata = await sharp(file.buffer).metadata();

    return {
      originalName: file.originalname,
      size: file.size, 
      mimeType: file.mimetype,
      width: metadata.width,
      height: metadata.height,
    };
  }
}
