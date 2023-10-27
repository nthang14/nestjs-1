import { Injectable, NotFoundException } from '@nestjs/common';
import { FolderDocument, Folder } from '~/folders/schemas/folders.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFolderDTO } from '~/folders/dto/create-folder.dto';
import { UpdateFolderDTO } from '~/folders/dto/update-folder.dto';

@Injectable()
export class FoldersService {
  constructor(
    @InjectModel(Folder.name) private readonly model: Model<FolderDocument>,
  ) {}

  async createFolder(folderPayload: CreateFolderDTO) {
    const folder = await this.model.create(folderPayload).then((f) =>
      f.populate([
        {
          path: 'owner',
          select: '_id avatar fullName',
        },
        {
          path: 'parent',
          select: 'title _id',
        },
        {
          path: 'shared',
          select: '_id avatar fullName',
        },
      ]),
    );
    if (!folder) {
      throw new NotFoundException('File upload failed');
    }
    return folder;
  }

  async getFolders(ownerId: string, parentId?: any) {
    const query = !!parentId ? { ownerId, parentId } : { ownerId };
    const folders = await this.model
      .find(query)
      .populate([
        {
          path: 'owner',
          select: '_id avatar fullName',
        },
        {
          path: 'parent',
          select: 'title _id',
        },
        {
          path: 'shared',
          select: '_id avatar fullName',
        },
      ])
      .exec();
    if (!folders) {
      throw new NotFoundException('Get folders failed !');
    }
    return {
      data: folders,
      statusCode: 200,
      message: 'Get file successfully !',
    };
  }

  async updateFolderById(
    folderId: string,
    ownerId: string,
    folderPayload: UpdateFolderDTO,
  ) {
    const { title } = folderPayload;
    const folder = await this.model
      .findOneAndUpdate(
        {
          _id: folderId,
          ownerId,
        },
        { $set: { title: title } },
        { new: true },
      )
      .populate([
        {
          path: 'owner',
          select: '_id avatar fullName',
        },
        {
          path: 'parent',
          select: 'title _id',
        },
        {
          path: 'shared',
          select: '_id avatar fullName',
        },
      ])
      .exec();
    if (!folder) {
      throw new NotFoundException('Folder update failed !');
    }
    return {
      statusCode: 200,
      data: folder,
      message: 'Folder updated successfully !',
    };
  }

  async sharingPermissionsFolder(
    folderId: string,
    ownerId: string,
    sharedIds: string[],
  ) {
    const folder = await this.model
      .findOneAndUpdate(
        {
          _id: folderId,
          ownerId: ownerId,
        },
        { $set: { sharedIds: sharedIds } },
        { new: true },
      )
      .populate([
        {
          path: 'owner',
          select: '_id avatar fullName',
        },
        {
          path: 'parent',
          select: 'title _id',
        },
        {
          path: 'shared',
          select: '_id avatar fullName',
        },
      ])
      .exec();
    if (!folder) {
      throw new NotFoundException('Shared failed !');
    }
    return {
      statusCode: 200,
      data: folder,
      message: 'Shared successfully !',
    };
  }

  async removePermissionsFolder(
    folderId: string,
    ownerId: string,
    userId: string,
  ) {
    const folder = await this.model
      .findOneAndUpdate(
        {
          _id: folderId,
          ownerId,
        },
        { $pullAll: { sharedIds: [userId] } },
        { new: true },
      )
      .populate([
        {
          path: 'owner',
          select: '_id avatar fullName',
        },
        {
          path: 'parent',
          select: 'title _id',
        },
        {
          path: 'shared',
          select: '_id avatar fullName',
        },
      ])
      .exec();
    if (!folder) {
      throw new NotFoundException('Remove permission failed !');
    }
    return {
      statusCode: 200,
      data: folder,
      message: 'Remove permission successfully !',
    };
  }
}
