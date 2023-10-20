import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { CloudinaryProvider } from '~/file/providers/cloudinary.provider';
import { CloudinaryService } from '~/file/cloudinary.service';
@Module({
  providers: [FileService, CloudinaryProvider, CloudinaryService],
  controllers: [FileController],
})
export class FileModule {}
