import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { AuthService } from '~/auth/auth.service';
import { LocalAuthGuard } from '~/auth/guards/local-auth.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
@Controller()
export class AppController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
