export abstract class MessageRepository {
    abstract create(userId: string, documentId: string, text: string, owner: string): Promise<{ id: string }>;

    abstract findAllByDocumentId(
      userId: string
    ): Promise<{ id: string; text: string; owner: string }[]>;  
  }
