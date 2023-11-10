import { Injectable, NotFoundException } from '@nestjs/common';
import { FolderDocument, Folder } from '~/folders/schemas/folders.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFolderDTO } from '~/folders/dto/create-folder.dto';
import { UpdateFolderDTO } from '~/folders/dto/update-folder.dto';
import { Search } from '~/types/index';
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
    return {
      data: folder,
      statusCode: 200,
      message: 'Create folder successfully !',
    };
  }

  async getFolders(ownerId: string, parentId?: any, querySearch?: Search) {
    const limit = querySearch.limit || 10;
    const skip = querySearch.page ? (querySearch.page - 1) * limit : 0;

    const query = !!parentId ? { ownerId, parentId } : { ownerId };
    const folders = await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
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
    const total = await this.model.find(query).count();
    const totalPage = Math.ceil(total / limit);
    if (!folders) {
      throw new NotFoundException('Get folders failed !');
    }
    return {
      data: folders,
      total: total,
      totalPage: totalPage,
      currentPage: parseInt(querySearch.page.toString()),
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
    console.log('folderId', folderId);
    console.log('ownerId', ownerId);
    console.log('sharedIds', sharedIds);
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

    console.log('folder', folder);
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

  async getAllFolderShareWithMe(sharedId: string) {
    const folders = await this.model
      .find({
        sharedId: { $elemMatch: { $in: [sharedId] } },
      })
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
      throw new NotFoundException('Get folder failed !');
    }
    return {
      data: folders,
      statusCode: 200,
      message: 'Get folder successfully !',
    };
  }

  async getFolderById(folderId: string, shareId: string, ownerId: string) {
    const folder = await this.model
      .find({
        $and: [
          {
            $or: [
              { ownerId: ownerId },
              { sharedId: { $elemMatch: { $in: [shareId] } } },
            ],
          },
          { _id: folderId },
        ],
      })
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
      throw new NotFoundException('Get folder failed !');
    }
    return {
      data: folder,
      statusCode: 200,
      message: 'Get folder successfully !',
    };
  }
}
