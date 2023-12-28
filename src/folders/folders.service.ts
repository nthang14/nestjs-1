import { Injectable, NotFoundException } from '@nestjs/common';
import { FolderDocument, Folder } from '~/folders/schemas/folders.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFolderDTO } from '~/folders/dto/create-folder.dto';
import { UpdateFolderDTO } from '~/folders/dto/update-folder.dto';
import { Search } from '~/types/index';
import * as mongoose from 'mongoose';
import { LIMIT_DEFAULT } from '~/utils/constants';
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
    const limit = querySearch?.limit || LIMIT_DEFAULT;
    const skip = querySearch?.page ? (querySearch?.page - 1) * limit : 0;
    const query = !querySearch?.star
      ? {
          ownerId: new mongoose.Types.ObjectId(ownerId),
          parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
        }
      : {
          $and: [
            {
              $or: [
                {
                  sharedIds: {
                    $elemMatch: { $in: [new mongoose.Types.ObjectId(ownerId)] },
                  },
                },
                {
                  ownerId: new mongoose.Types.ObjectId(ownerId),
                },
              ],
            },
            {
              parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
            },
            {
              startIds: {
                $elemMatch: { $in: [new mongoose.Types.ObjectId(ownerId)] },
              },
            },
          ],
        };
    const folders = await this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'owner',
          select: '_id username fullName',
        },
        {
          path: 'parent',
          select: 'title _id',
        },
        {
          path: 'shared',
          select: '_id username fullName',
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

  async updateStartFolderById(folderId: string, ownerId: string) {
    const folder = await this.model
      .findOneAndUpdate(
        {
          _id: folderId,
          ownerId,
        },
        { $set: { startIds: [ownerId] } },
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

  async removeStart(folderId: string, ownerId: string) {
    const folder = await this.model
      .findOneAndUpdate(
        {
          _id: folderId,
          ownerId,
        },
        { $pullAll: { startIds: [ownerId] } },
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

  async getAllFolderShareWithMe(sharedId: string, isStart) {
    const query = !isStart
      ? {
          sharedIds: {
            $elemMatch: { $in: [new mongoose.Types.ObjectId(sharedId)] },
          },
        }
      : {
        $and: [
          {
            sharedIds: {
              $elemMatch: { $in: [new mongoose.Types.ObjectId(sharedId)] },
            },
          },
          {
            startIds: {
              $elemMatch: { $in: [new mongoose.Types.ObjectId(sharedId)] },
            },
          },
        ]
      };
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
              { sharedIds: { $elemMatch: { $in: [shareId] } } },
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

  async deleteFolderById(folderId: string, ownerId: string) {
    const result = await this.model
      .findOneAndDelete({ _id: folderId, ownerId: ownerId })
      .exec();

    if (!result) {
      throw new NotFoundException('Folder deleted failed !');
    }
    return {
      message: 'Folder deleted successfully',
      statusCode: 200,
    };
  }
}
