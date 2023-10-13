import { Controller, Get, Put, Param, Body, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly service: UsersService) {}

  @Get()
  async getListUser() {
    return await this.service.getListUser();
  }
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto ) {
    return await this.service.updateUserById(id, user);
  }
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.service.deleteUser(id);
  }
}
