import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CloudinaryService } from '~/file/cloudinary.service';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
// import { Request } from 'express';
// import { UploadInput } from '~/file/dto/create-upload.dto';
@Controller('')
export class FileController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/file/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('createUploadDto', file);
    // const { file } = createUploadDto;
    try {
      const { url } = await this.cloudinaryService.uploadFile(file);
      console.log('url', url);
      //   return uploadInfo;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
