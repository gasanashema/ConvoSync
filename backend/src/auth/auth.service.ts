import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email)
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user.toObject()
      return result
    }
    return null
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user._id,
      email: user.email,
    }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    }
  }

  async register(username: string, email: string, pass: string) {
    const existingUser = await this.usersService.findOneByEmail(email)
    if (existingUser) {
      throw new ConflictException('User with this email already exists')
    }

    const passwordHash = await bcrypt.hash(pass, 10)
    const newUser = await this.usersService.create({
      username,
      email,
      passwordHash,
    })

    return this.login(newUser)
  }
}
