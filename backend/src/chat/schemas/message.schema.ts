import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type MessageDocument = Message & Document

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId

  @Prop({ required: true })
  content: string

  @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
  chatId: Types.ObjectId

  @Prop({ enum: ['normal', 'important', 'urgent'], default: 'normal' })
  priority: string

  @Prop({ enum: ['sent', 'delivered', 'read'], default: 'sent' })
  status: string

  @Prop({ enum: ['text', 'image', 'file'], default: 'text' })
  type: string

  @Prop({
    type: [{ userId: { type: Types.ObjectId, ref: 'User' }, emoji: String }],
    default: [],
  })
  reactions: { userId: Types.ObjectId; emoji: string }[]
}

export const MessageSchema = SchemaFactory.createForClass(Message)
