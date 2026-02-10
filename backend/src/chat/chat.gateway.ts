import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.headers.authorization?.split(' ')[1]

      if (!token) {
        client.disconnect()
        return
      }
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      })
      const user = await this.usersService.findOneById(payload.sub)
      if (!user) {
        client.disconnect()
        return
      }

      client.data.user = user

      user.status = 'online'
      await user.save()

      this.server.emit('userStatusChanged', {
        userId: user._id,
        status: 'online',
      })
    } catch (e) {
      client.disconnect()
    }
  }

  async handleDisconnect(client: Socket) {
    if (client.data.user) {
      const user = await this.usersService.findOneById(client.data.user._id)
      if (user) {
        user.status = 'offline'
        await user.save()
        this.server.emit('userStatusChanged', {
          userId: user._id,
          status: 'offline',
        })
      }
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.join(roomId)
    return { event: 'joinedRoom', data: roomId }
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.leave(roomId)
    return { event: 'leftRoom', data: roomId }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { chatId: string; content: string; priority?: string },
  ) {
    try {
      const userId = client.data.user._id
      const { chatId, content, priority } = payload

      const message = await this.chatService.createMessage(
        userId,
        chatId,
        content,
        priority,
      )

      const populatedMessage = await message.populate(
        'senderId',
        'username avatar',
      )

      this.server.to(chatId).emit('newMessage', populatedMessage)
    } catch (error) {}
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; isTyping: boolean },
  ) {
    client.to(payload.chatId).emit('typing', {
      userId: client.data.user._id,
      username: client.data.user.username,
      isTyping: payload.isTyping,
    })
  }
}
