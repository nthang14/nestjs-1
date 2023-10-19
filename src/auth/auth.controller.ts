import { Controller, Post, Req, UseGuards, Get } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '~/auth/guards/local-auth.guard';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { UsersService } from '~/users/users.service';
@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  // eslint-disable-next-line prettier/prettier
  async login(@Req() request: Request) {
    return await this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() request: Request) {
    const { _id }: any = request.user;
    const result = await this.userService.getUserById(_id);
    return result;
  }
}
