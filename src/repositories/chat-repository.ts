export abstract class ChatRepository{
    abstract create(name: string, userId: string): Promise<{id: string; name: string; createdAt: Date}>;

    abstract findById(id: string): Promise<{ id: string; name: string; createdAt: Date} | null>;

    abstract updateName(id: string, name: string): Promise<{}>;

    abstract findAllByUserId(userId: string): Promise<{ id: string; name: string; createdAt: Date; accessed: Date }[]>;
    
    abstract updateAccessed(id: string): Promise<{} | null>
    
}