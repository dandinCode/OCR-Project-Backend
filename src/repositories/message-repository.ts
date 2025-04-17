export abstract class MessageRepository {
    abstract create(userId: string, chatId: string, text: string, owner: string): Promise<{ id: string }>;

    abstract findAllByChatId(
      chatId: string
    ): Promise<{ id: string; text: string; owner: string }[]>;  
  }
