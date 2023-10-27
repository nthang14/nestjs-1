import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '~/users/users.controller';
import { UsersService } from '~/users/users.service';
import { Users, UsersSchema } from '~/users/schemas/users.schema';
import { JwtStrategy } from '~/auth/jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  exports: [UsersService],
})
export class UserModule {}
