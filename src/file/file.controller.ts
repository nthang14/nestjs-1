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
  Body,
  Put,
  Delete,
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
    @Body() body: any,
    @Req() request: Request,
  ) {
    const { parentId } = body;
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
        ownerId,
        parentId,
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
    const parentId = request?.query?.parentId ?? '';
    const isStar = request?.query?.isStar ?? null;

    return await this.fileService.getAllFileOwnerIdAndParentId(
      ownerId,
      parentId,
      isStar,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('/files/shared-me')
  async getFileBySharedId(@Req() request: Request) {
    const { _id: ownerId }: any = request.user;
    const parentId = request?.query?.parentId ?? '';
    const isStar = request?.query?.isStar ?? null;
    return await this.fileService.getAllFileSharedId(ownerId, parentId, isStar);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/files/:id')
  async getFileById(@Req() request: Request, @Param('id') id: string) {
    const { _id: ownerId }: any = request.user;
    return await this.fileService.getFileById(id, ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/files/:id/sharing')
  async sharingPermissionsFile(
    @Param('id') id: string,
    @Body() body: string[],
    @Req() request: Request,
  ) {
    const { sharedIds }: any = body;
    const { _id: ownerId }: any = request.user;
    try {
      const result = await this.fileService.sharingPermissionsFile(
        id,
        ownerId,
        sharedIds,
      );
      return result;
    } catch (err) {
      console.log('err', err);
    }
  }
  @UseGuards(JwtAuthGuard)
  @Delete('/files/:id')
  async deleteFile(@Param('id') id: string, @Req() request: Request) {
    const { _id: ownerId }: any = request.user;
    return await this.fileService.deleteFileById(id, ownerId);
  }
  @UseGuards(JwtAuthGuard)
  @Put('/files/:id/star')
  async updateStarFile(
    @Param('id') id: string,
    @Body() start: { isStar: boolean },
    @Req() request: Request,
  ) {
    const { _id: ownerId }: any = request.user;
    return await this.fileService.updateStartFileById(
      id,
      ownerId,
      start.isStar,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put('/files/:id/remove')
  async removePermissionsFile(
    @Param('id') id: string,
    @Body() body: string,
    @Req() request: Request,
  ) {
    const { userId }: any = body;
    const { _id: ownerId }: any = request.user;
    return await this.fileService.removePermissionsFile(id, ownerId, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Put('/files/:id')
  async updateFile(
    @Param('id') id: string,
    @Body() file: any,
    @Req() request: Request,
  ) {
    const { _id: ownerId }: any = request.user;
    return await this.fileService.updateFileById(id, ownerId, file?.title);
  }
}
