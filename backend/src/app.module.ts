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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
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
