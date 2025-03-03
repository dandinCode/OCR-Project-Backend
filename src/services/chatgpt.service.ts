import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import OpenAI from 'openai';
const axios = require('axios');

@Injectable()
export class OpenAIService {
  private openai = new OpenAI();
  private readonly apiKey = process.env.OPENAI_API_KEY;
 

  async generateText(prompt: string, extractedText: string): Promise<string> {
    try {
      const promptConcatened = extractedText + ' - ' + prompt;
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: "system", content: promptConcatened }],
        model: "gpt-4o-mini",
        top_p: 0.1,
        temperature: 0.2,
        max_tokens: 150,
      });

      return completion.choices[0].message.content;

    } catch (error) {
      if (error.message.includes('exceeded your current quota')) {
        throw new HttpException(
          'Limite de uso da API excedido. Verifique sua conta.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Erro ao acessar a API OpenAI.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listModels(): Promise<string> {
    try {
      const apiUrl = "https://api.openai.com/v1/models";
      axios.get(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        }
      })
      .then(response =>{
        console.log(response.data)
      })
      .catch(error=>console.log(error));

      return 'eita'

    } catch (error) {
      if (error.message.includes('exceeded your current quota')) {
        throw new HttpException(
          'Limite de uso da API excedido. Verifique sua conta.',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
      throw new HttpException(
        'Erro ao acessar a API OpenAI.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
