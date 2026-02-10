import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ChatDocument = Chat & Document

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  participants: Types.ObjectId[]

  @Prop({ enum: ['one-to-one', 'group'], default: 'one-to-one' })
  type: string

  @Prop()
  name?: string // For group chats

  @Prop({ type: Types.ObjectId, ref: 'Message' })
  lastMessage?: Types.ObjectId
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
