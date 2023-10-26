import {
  Controller,
  UseGuards,
  Post,
  UseInterceptors,
  UploadedFile,
  Req,
  NotFoundException,
  Get,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from '~/file/google-drive.service';
import { FileService } from '~/file/file.service';
@Controller('')
export class FileController {
  constructor(
    private readonly googleDriveService: GoogleDriveService,
    private readonly fileService: FileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/files/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    // console.log('request', request.user);
    const { _id: ownerId }: any = request.user;
    try {
      const {
        id,
        fileExtension,
        title,
        webContentLink,
        fileSize,
        thumbnailLink,
        iconLink,
      } = await this.googleDriveService.uploadFile(file);
      const filePayload = {
        ggId: id,
        fileExtension,
        title,
        webContentLink,
        fileSize,
        thumbnailLink,
        iconLink,
        sharedId: ['test'],
        ownerId,
      };
      return await this.fileService.createFile(filePayload);
    } catch (error) {
      throw new NotFoundException('User create failed');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/files')
  async getFileByOwnerId(@Req() request: Request) {
    const { _id: ownerId }: any = request.user;
    return await this.fileService.getAllFileOwnerId(ownerId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/files/shared-me')
  async getFileBySharedId(@Req() request: Request) {
    const { _id: ownerId }: any = request.user;
    return await this.fileService.getAllFileSharedId(ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/files/:id')
  async getFileById(@Req() request: Request, @Param('id') id: string) {
    const { _id: ownerId }: any = request.user;
    return await this.fileService.getFileById(id, ownerId);
  }
}
