import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Delete,
  UseGuards,
  Post,
  Query,
  Req
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { Request } from 'express';
@Controller('users')
export class UsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly service: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getListUser(@Query() query: any) {
    return await this.service.getListUser(query);
  }

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    return await this.service.createUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.service.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateUser(@Req() request: Request, @Body() user: UpdateUserDto) {
    const { _id: id }: any = request.user;
    return await this.service.updateUserById(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.service.deleteUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  async changePassword(@Req() request: Request, @Body() user: UpdateUserDto) {
    const { _id: id }: any = request.user;
    return await this.service.changePassword(id, user.password);
  }
}
