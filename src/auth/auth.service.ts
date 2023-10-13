import { Injectable } from '@nestjs/common';
import { UsersService } from '~/users/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserByEmail(username);
    if (!!user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
