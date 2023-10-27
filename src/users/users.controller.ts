import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
@Controller('users')
export class UsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly service: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getListUser() {
    return await this.service.getListUser();
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
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    return await this.service.updateUserById(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.service.deleteUser(id);
  }
}
