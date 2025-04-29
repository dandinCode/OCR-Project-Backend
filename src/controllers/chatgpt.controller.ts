import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { OpenAIService } from '../services/chatgpt.service';
import { MessageRepository } from '../repositories/message-repository';
import { UserRepository } from '../repositories/user-repository';
import { DocumentRepository } from '@/repositories/document-repository';
import { ChatRepository } from '@/repositories/chat-repository';


@Controller('openai')
export class OpenAIController {
  constructor(
    private readonly openAIService: OpenAIService, 
    private messageRepository: MessageRepository,  
    private userRepository: UserRepository,  
    private documentRepository: DocumentRepository,
    private chatRepository: ChatRepository
  ) {}
 
  @Post('chat')
  async chat(@Body() body: { prompt: string, userId: string, chatId: string }) {
    try{
      const { prompt, userId, chatId } = body;

      const user = await this.userRepository.findById(userId);

      await this.chatRepository.updateAccessed(chatId, )

      const documents = await this.documentRepository.findAllByChatId(chatId);
      const concatenatedText = documents
        .map(doc => `imagem ${doc.name || doc.filePath.split("\\").pop()}: ${doc.extractedText}`)
        .join(", ");

      const { response, totalTokensUsed } = await this.openAIService.generateText(prompt, concatenatedText, user.maxTokens<5000?user.maxTokens:5000);

      await this.userRepository.updateMaxTokens(userId, (user.maxTokens - totalTokensUsed));
  
      await this.messageRepository.create(userId, chatId, prompt, "user");
      await this.messageRepository.create(userId, chatId, response, "chatgpt");
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

  @Get('messages/:chatId')
  async listMessages(@Param('chatId') chatId: string) {
    try{
      if (!chatId) {
        return { error: 'User ID is required' };
      }
      const messages = await this.messageRepository.findAllByChatId(chatId);
      return messages;
    } catch (error) {
      console.error('Error fetching document:', error);
      return { success: false, error: error.message };
    }
  }
}
