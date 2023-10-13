import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
// import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  // eslint-disable-next-line prettier/prettier
  async login(@Req() request: Request) {
    return request.body;
  }
}
