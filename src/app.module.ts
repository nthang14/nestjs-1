import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';
import { NoteModule } from './note/note.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    UserModule,
    NoteModule,
    AuthModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/Project-nest1'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
