import { ChatRepository } from "@/repositories/chat-repository";
import { DocumentRepository } from "@/repositories/document-repository";
import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import fs from 'fs';
import path from 'path';

@Controller('chat')
export class ChatController{
    constructor(
            private chatRepository: ChatRepository,
            private documentRepository: DocumentRepository
        ) {}

    @Post()
    async create(@Body() body: { name: string, userId: string }){
        try{
            const {name, userId} = body;

            const chat = await this.chatRepository.create(name, userId);

            return {success: true, chat};
        } catch(error){
            return { success: false, error: error.message };
        }
    }

    @Get(":id")
    async getChat(@Param('id') id: string){
        try{
            const chat = await this.chatRepository.findById(id);

            return { success: true, chat };
        } catch(error){
            return { success: false, error: error.message };
        }
    }

    @Get("listChats/:userId")
    async getAllChats(@Param('userId') userId: string){
        try{
            const chats = await this.chatRepository.findAllByUserId(userId);

            return { success: true, chats };
        } catch(error){
            return { success: false, error: error.message };
        }
    }

    @Put("/update")
    async update(@Body() body: {chatId: string, name: string }){
        try{
            const {chatId, name} = body;

            await this.chatRepository.updateName(chatId, name);

            return { success: true };
        } catch(error){
            return { success: false, error: error.message };
        }
    }

    @Delete("/delete")
    async delete(@Body() body: {chatId: string }){
        try{
            const {chatId} = body;

            await this.chatRepository.delete(chatId);

            return { success: true };
        } catch(error){
            return { success: false, error: error.message };
        }
    }
}