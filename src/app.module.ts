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
    MongooseModule.forRoot(
      'mongodb+srv://nguyenhang04141997:Hang1441997@cluster0.hqeq7yk.mongodb.net/Document',
    ),
    FileModule,
    FoldersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
