import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { GoogleDriveService } from '~/file/google-drive.service';
import { JwtStrategy } from '~/auth/jwt.strategy';
import { File, FileSchema } from '~/file/schemas/file.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  providers: [FileService, GoogleDriveService, JwtStrategy],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
