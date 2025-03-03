import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import Tesseract, { createWorker } from 'tesseract.js';

@Injectable()
export class OcrService {
    async extractText(imagePath: string): Promise<string> {      
        try {
            const worker = await createWorker('eng');
            console.log("\n worker:", worker);
            const result = await worker.recognize(imagePath);
            console.log(result.data.text);
            await worker.terminate();
            return result.data.text;
        } catch (error) {
          console.error("Erro no OCR:", error);
          throw new Error('Falha ao processar a imagem: ' + error.message);
        }
      }
      
}
