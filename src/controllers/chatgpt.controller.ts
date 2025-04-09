import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OpenAIService } from '../services/chatgpt.service';
import { MessageRepository } from '../repositories/message-repository';
import { UserRepository } from '../repositories/user-repository';


@Controller('openai')
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService, private messageRepository: MessageRepository,  private userRepository: UserRepository) {}
 
  @Post('chat')
  async chat(@Body() body: { prompt: string, document: Document }) {
    try{
      const { prompt, document } = body;

      const user = await this.userRepository.findById(document.userId);

      const { response, totalTokensUsed } = await this.openAIService.generateText(prompt, document.extractedText, user.maxTokens<5000?user.maxTokens:5000);

      await this.userRepository.updateMaxTokens(document.userId, (user.maxTokens - totalTokensUsed));
  
      await this.messageRepository.create(document.userId, document.id, prompt, "user");
      await this.messageRepository.create(document.userId, document.id, response, "chatgpt");
    } catch (error) {
        console.error('Error fetching document:', error);
        return { success: false, error: error.message };
    }
    
  }

  @Get('models')
  async getModels() {
    try{
      return this.openAIService.listModels();
    } catch (error) {
      console.error('Error fetching document:', error);
      return { success: false, error: error.message };
    }
    
  }

  @Get('messages/:documentId')
  async listMessages(@Param('documentId') documentId: string) {
    try{
      if (!documentId) {
        return { error: 'User ID is required' };
      }
      const messages = await this.messageRepository.findAllByDocumentId(documentId);
      return messages;
    } catch (error) {
      console.error('Error fetching document:', error);
      return { success: false, error: error.message };
    }
  }
}

interface Document {
  id: string;
  userId: string;
  filePath: string;
  extractedText: string;
  name: string;
}