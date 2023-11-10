import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Put,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { Request } from 'express';

import { FoldersService } from '~/folders/folders.service';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { CreateFolderDTO } from '~/folders/dto/create-folder.dto';
import { UpdateFolderDTO } from '~/folders/dto/update-folder.dto';
import { FileService } from '~/file/file.service';
import { Search } from '~/types/index';

@Controller('folders')
export class FoldersController {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly fileService: FileService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async createFolder(@Body() folder: CreateFolderDTO, @Req() request: Request) {
    const { _id: ownerId }: any = request.user;
    return await this.foldersService.createFolder({ ...folder, ownerId });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateFolder(
    @Param('id') id: string,
    @Body() folder: UpdateFolderDTO,
    @Req() request: Request,
  ) {
    const { _id: ownerId }: any = request.user;
    return await this.foldersService.updateFolderById(id, ownerId, {
      ...folder,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getFolders(@Req() request: Request, @Query() querySearch: Search) {
    const { _id: ownerId }: any = request.user;
    const parentId = request?.query?.parentId ?? '';
    return await this.foldersService.getFolders(ownerId, parentId, querySearch);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id/sharing')
  async sharingPermissionsFolder(
    @Param('id') id: string,
    @Body() body: string[],
    @Req() request: Request,
  ) {
    const { sharedIds }: any = body;
    const { _id: ownerId }: any = request.user;
    try {
      const result = await this.foldersService.sharingPermissionsFolder(
        id,
        ownerId,
        sharedIds,
      );
      if (result) {
        await this.fileService.sharingPermissionsFileFollowFolder(
          id,
          ownerId,
          sharedIds,
        );
      }
      return result;
    } catch (err) {
      console.log('err', err);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/remove')
  async removePermissionsFolder(
    @Param('id') id: string,
    @Body() body: string,
    @Req() request: Request,
  ) {
    const { userId }: any = body;
    const { _id: ownerId }: any = request.user;
    return await this.foldersService.removePermissionsFolder(
      id,
      ownerId,
      userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/shared-me')
  async getFolderBySharedId(@Req() request: Request) {
    const { _id: ownerId }: any = request.user;
    return await this.foldersService.getAllFolderShareWithMe(ownerId);
  }
}
