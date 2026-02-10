import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

import * as os from 'os'
import { join } from 'path'

// Determine upload directory
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL
const uploadDir = isProduction ? os.tmpdir() : './uploads'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Request() req) {
    return this.usersService.findAllExcept(req.user.userId)
  }

  @Get('search')
  async searchUsers(@Query('q') query: string, @Request() req) {
    if (!query) return []
    return this.usersService.searchUsers(query, req.user._id)
  }

  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9)
          const ext = extname(file.originalname)
          callback(null, `avatar-${uniqueSuffix}${ext}`)
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          )
        }
        callback(null, true)
      },
    }),
  )
  async uploadAvatar(@UploadedFile() file: any, @Request() req) {
    if (!file) {
      throw new BadRequestException('File is not provided')
    }
    const avatarUrl = `/uploads/${file.filename}`
    await this.usersService.updateAvatar(req.user.userId, avatarUrl)
    return { avatarUrl }
  }
}
