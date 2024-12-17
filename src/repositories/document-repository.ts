export abstract class DocumentRepository {
  abstract create(userId: string, filePath: string, extractedText: string, name: string): Promise<{ 
      id: string; 
      filePath: string; 
      extractedText: string; 
      name: string;
    }>;
  
  abstract findById(id: string): Promise<{ id: string; filePath: string; extractedText: string; name: string} | null>;

  abstract findAllByUserId(
    userId: string
  ): Promise<{ id: string; filePath: string; extractedText: string; name: string }[]>;  
}