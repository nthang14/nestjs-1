import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  // eslint-disable-next-line prettier/prettier
  constructor(@InjectModel(Users.name) private readonly model: Model<UsersDocument>) {}
  async getListUser() {
    const users = await this.model.find().exec();
    return users;
  }
  async getUserById(id: string) {
    const user = await this.model.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }
  async updateUserById(id: string, userPayload: Users) {
    const user = await this.model.findByIdAndUpdate(id, userPayload,  { new: true }).exec();
    console.log('user', user)
    if (!user) {
      throw new NotFoundException('User update failed');
    }
    return user;
  }
  async deleteUser(id: string) {
    const result = await this.model.findByIdAndDelete(id).exec()
    const users = await this.model.find().exec();
    if (!!result) {
      return {
        data: users,
        message: 'User deleted successfully'
      }
    } else {
      return {
        code: 404,
        message: 'User deleted failed'
      }
    }
  }
  async findUserByEmail(username: string) {
    const user = await this.model.findOne({username: username}).exec();
    if (!!user) {
      return user
    } else { return null}
  }
}
