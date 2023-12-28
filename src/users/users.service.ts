import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from '~/users/schemas/users.schema';
import { Model } from 'mongoose';
import { PAGE_DEFAULT, LIMIT_DEFAULT } from '~/utils/constants';
@Injectable()
export class UsersService {
  // eslint-disable-next-line prettier/prettier
  constructor(
    @InjectModel(Users.name) private readonly model: Model<UsersDocument>,
  ) {}

  async createUser(userPayload: Users) {
    const user = await this.model.create(userPayload);
    if (!user) {
      throw new NotFoundException('User create failed !');
    }
    return {
      data: user,
      statusCode: 201,
      message: 'User create successfully !',
    };
  }
  async getListUser(query: any) {
    const limit = query?.limit || LIMIT_DEFAULT;
    const skip = ((query?.page || PAGE_DEFAULT) - 1) * limit;
    const users = await this.model
      .find({
        fullName: { $regex: query?.fullName || '', $options: 'i' },
      })
      .skip(skip)
      .limit(limit)
      .exec();
    return users;
  }
  async getUserById(id: string) {
    const user = await this.model.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found !');
    }
    return {
      data: user,
      statusCode: 201,
      message: 'Get user successfully !',
    };
  }
  async updateUserById(id: string, userPayload: any) {
    const user = await this.model
      .findByIdAndUpdate(id, userPayload, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('User update failed !');
    }
    return {
      statusCode: 200,
      data: user,
      message: 'User updated successfully !',
    };
  }
  async changePassword(id: string, password: string) {
    const user = await this.model
      .findByIdAndUpdate(id, { password: password }, { new: true })
      .exec();
    if (!user) {
      throw new NotFoundException('Change password failed !');
    }
    return {
      statusCode: 200,
      data: user,
      message: 'Change password successfully !',
    };
  }
  async deleteUser(id: string) {
    const result = await this.model.findByIdAndDelete(id).exec();
    const users = await this.model.find().exec();
    if (!!result) {
      return {
        data: users,
        message: 'User deleted successfully !',
        statusCode: 200,
      };
    } else {
      return {
        statusCode: 404,
        message: 'User deleted failed !',
      };
    }
  }
  async findUserByEmail(username: string) {
    const user = await this.model.findOne({ username: username }).exec();
    if (!!user) {
      return user;
    } else {
      return null;
    }
  }
}
