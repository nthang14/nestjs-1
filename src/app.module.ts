import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { UserModule } from '~/users/users.module';
import { AuthModule } from '~/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileModule } from '~/file/file.module';
import { FoldersModule } from './folders/folders.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/Project-nest1'),
    FileModule,
    FoldersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
