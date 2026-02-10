import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Chat, ChatDocument } from './schemas/chat.schema'
import { Message, MessageDocument } from './schemas/message.schema'

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createMessage(
    senderId: string,
    chatId: string,
    content: string,
    priority: string = 'normal',
  ): Promise<MessageDocument> {
    const newMessage = new this.messageModel({
      senderId: new Types.ObjectId(senderId),
      chatId: new Types.ObjectId(chatId),
      content,
      priority,
    })
    const savedMessage = await newMessage.save()

    await this.chatModel.findByIdAndUpdate(chatId, {
      lastMessage: savedMessage._id,
    })

    return savedMessage
  }

  async getMessages(chatId: string): Promise<Message[]> {
    return this.messageModel
      .find({ chatId: new Types.ObjectId(chatId) })
      .sort({ createdAt: 1 })
      .populate('senderId', 'username avatar')
      .exec()
  }

  async createChat(participantIds: string[]): Promise<Chat> {
    const participants = participantIds.map((id) => new Types.ObjectId(id))


    if (participants.length === 2) {
      const existingChat = await this.chatModel.findOne({
        participants: { $all: participants },
        type: 'one-to-one',
      })
      if (existingChat) return existingChat
    }

    const newChat = new this.chatModel({ participants })
    return newChat.save()
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find({ participants: new Types.ObjectId(userId) })
      .populate('participants', 'username avatar status')
      .populate('lastMessage')
      .sort({ updatedAt: -1 })
      .exec()
  }
}
