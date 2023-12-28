import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { File, FileDocument } from '~/file/schemas/file.schema';
import { Model } from 'mongoose';
import { CreateFileDTO } from '~/file/dto/create-file.dto';
import { GoogleDriveService } from '~/file/google-drive.service';
import * as mongoose from 'mongoose';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private readonly model: Model<FileDocument>,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  async createFile(filePayload: CreateFileDTO) {
    const file = await this.model.create(filePayload).then((f) =>
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
    if (!file) {
      throw new NotFoundException('File upload failed !');
    }
    return {
      data: file,
      statusCode: 201,
      message: 'Upload file successfully !',
    };
  }

  async getAllFileOwnerIdAndParentId(
    ownerId: string,
    parentId?: any,
    isStar?: any,
  ) {
    const query = isStar
      ? {
          ownerId: new mongoose.Types.ObjectId(ownerId),
          parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
          startIds: {
            $elemMatch: { $in: [new mongoose.Types.ObjectId(ownerId)] },
          },
        }
      : {
          ownerId: new mongoose.Types.ObjectId(ownerId),
          parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
        };

    const files = await this.model
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
    if (!files) {
      throw new NotFoundException('Get file failed !');
    }
    const token = await this.googleDriveService.getTokenGG();
    return {
      data: files,
      statusCode: 200,
      googleToken: token,
      message: 'Get file successfully !',
    };
  }

  async getAllFileSharedId(sharedId: string, parentId?: any, star?: any) {
    const query = !star
      ? {
          sharedIds: {
            $elemMatch: { $in: [new mongoose.Types.ObjectId(sharedId)] },
          },
          parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
        }
      : {
          $and: [
            {
              sharedIds: {
                $elemMatch: { $in: [new mongoose.Types.ObjectId(sharedId)] },
              },
            },
            {
              parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
            },
            {
              startIds: {
                $elemMatch: { $in: [new mongoose.Types.ObjectId(sharedId)] },
              },
            },
          ],
        };
    const files = await this.model
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
    const token = await this.googleDriveService.getTokenGG();
    if (!files) {
      throw new NotFoundException('Get file failed !');
    }
    return {
      data: files,
      statusCode: 200,
      googleToken: token,
      message: 'Get file successfully !',
    };
  }

  async getFileById(fileId: string, readerPermissionsId: string) {
    const file = await this.model
      .findOne({
        $and: [
          {
            $or: [
              { ownerId: { $eq: readerPermissionsId } },
              { sharedId: { $elemMatch: { $in: [readerPermissionsId] } } },
            ],
          },
          { _id: fileId },
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
    if (!file) {
      throw new NotFoundException('Get file failed');
    }
    return {
      data: file,
      statusCode: 200,
      message: 'Get file successfully !',
    };
  }

  async deleteFileById(fileId: string, ownerId: string) {
    const result = await this.model
      .findOneAndDelete({ _id: fileId, ownerId: ownerId })
      .exec();

    if (!result) {
      throw new NotFoundException('File deleted failed !');
    }
    return {
      message: 'File deleted successfully',
      statusCode: 200,
    };
  }

  async sharingPermissionsFile(
    fileId: string,
    ownerId: string,
    sharedIds: string[],
  ) {
    const file = await this.model
      .findOneAndUpdate(
        {
          _id: fileId,
          ownerId: ownerId,
        },
        { $set: { sharedIds: sharedIds } },
        { new: true },
      )
      .populate([
        {
          path: 'owner',
          select: '_id username fullName',
        },
        {
          path: 'parent',
          select: 'title _id ',
        },
        {
          path: 'shared',
          select: '_id username fullName',
        },
      ])
      .exec();

    if (!file) {
      throw new NotFoundException('Shared failed !');
    }
    return {
      statusCode: 200,
      data: file,
      message: 'Shared successfully !',
    };
  }

  async removePermissionsFile(fileId: string, ownerId: string, userId: string) {
    const file = await this.model
      .findOneAndUpdate(
        {
          _id: fileId,
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

    if (!file) {
      throw new NotFoundException('Remove permission failed !');
    }
    return {
      statusCode: 200,
      data: file,
      message: 'Remove permission successfully !',
    };
  }

  async sharingPermissionsFileFollowFolder(
    folderId: string,
    ownerId: string,
    sharedIds: string[],
  ) {
    const result = await this.model
      .updateMany(
        { parentId: folderId, ownerId: ownerId },
        { $addToSet: { sharedIds: sharedIds } },
        { multi: true, new: true },
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
    if (!result) {
      throw new NotFoundException('Shared failed !');
    }
    return {
      statusCode: 200,
      data: result,
      message: 'Shared successfully !',
    };
  }

  async removePermissionsFollowFolder(
    folderId: string,
    ownerId: string,
    userId: string,
  ) {
    const result = await this.model
      .updateMany(
        { parentId: folderId, ownerId: ownerId },
        { $pullAll: { sharedIds: [userId] } },
        { new: true, multi: true },
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

    if (!result) {
      throw new NotFoundException('Shared failed !');
    }
    return {
      statusCode: 200,
      data: result,
      message: 'Shared successfully !',
    };
  }
  async updateStartFileById(
    fileId: string,
    ownerId: string,
  ) {
    const folder = await this.model
      .findOneAndUpdate(
        {
          _id: fileId,
          ownerId,
        },
        { $set: { startIds: [ownerId] } },
        { new: true },
      )
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
  async removeStart(fileId: string, ownerId: string) {
    const folder = await this.model
      .findOneAndUpdate(
        {
          _id: fileId,
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
      throw new NotFoundException('Remove start failed !');
    }
    return {
      statusCode: 200,
      data: folder,
      message: 'Remove start successfully !',
    };
  }

  async updateFileById(fileId: string, ownerId: string, title: string) {
    const folder = await this.model
      .findOneAndUpdate(
        {
          _id: fileId,
          ownerId,
        },
        { $set: { title: title } },
        { new: true },
      )
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

  async totalSizeFile(ownerId: string) {
    return await this.model.aggregate([
      {
        $match: {
          ownerId: ownerId,
        },
      },
      {
        $group: {
          _id: null,
          totalByte: { $sum: '$fileSize' },
        },
      },
    ]);
  }
}
