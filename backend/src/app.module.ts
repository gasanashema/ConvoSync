import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ChatModule } from './chat/chat.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

import { join } from 'path'
import { ServeStaticModule } from '@nestjs/serve-static'

import * as os from 'os'

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL
const uploadDir = isProduction ? os.tmpdir() : join(__dirname, '..', 'uploads')

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ServeStaticModule.forRoot({
      rootPath: uploadDir,
      serveRoot: '/uploads',
    }),
    UsersModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
