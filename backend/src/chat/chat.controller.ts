import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common'
import { ChatService } from './chat.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async createChat(@Request() req, @Body() body: { userId: string }) {
    // Basic 1-on-1 chat creation
    return this.chatService.createChat([req.user._id, body.userId])
  }

  @Get()
  async getUserChats(@Request() req) {
    return this.chatService.getUserChats(req.user._id)
  }

  @Get(':chatId/messages')
  async getMessages(@Param('chatId') chatId: string) {
    return this.chatService.getMessages(chatId)
  }
}
