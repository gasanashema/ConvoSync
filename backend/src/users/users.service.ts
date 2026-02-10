import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(userData: Partial<User>): Promise<User> {
    const createdUser = new this.userModel(userData)
    return createdUser.save()
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec()
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec()
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec()
  }

  async searchUsers(query: string, currentUserId: string): Promise<User[]> {
    return this.userModel
      .find({
        $and: [
          { _id: { $ne: currentUserId } },
          {
            $or: [
              { username: { $regex: query, $options: 'i' } },
              { email: { $regex: query, $options: 'i' } },
            ],
          },
        ],
      })
      .select('username email avatar status')
      .limit(10)
      .exec()
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true })
      .exec()
  }
}
