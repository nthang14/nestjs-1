import { Injectable } from '@nestjs/common';
import { UsersService } from '~/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  // eslint-disable-next-line prettier/prettier
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findUserByEmail(username);
    if (!!user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return user;
    }
    return null;
  }

  async login(user: any) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...profile } = user.toJSON();
    const payload = {
      username: user.username,
      _id: user._id,
    };
    return {
      data: {
        access_token: this.jwtService.sign(payload, {
          secret: jwtConstants.secret,
          expiresIn: '1d',
        }),
        refresh_token: this.jwtService.sign(payload, {
          secret: 'refresh_token_secret',
          expiresIn: '6d',
        }),
        profile: profile,
      },
      success: true,
      statusCode: 200,
      message: 'Login successfully !',
    };
  }
}
