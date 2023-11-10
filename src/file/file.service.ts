import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { File, FileDocument } from '~/file/schemas/file.schema';
import { Model } from 'mongoose';
import { CreateFileDTO } from '~/file/dto/create-file.dto';
import { GoogleDriveService } from '~/file/google-drive.service';

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

  async getAllFileOwnerIdAndParentId(ownerId: string, parentId?: any) {
    const query = !!parentId ? { ownerId, parentId } : { ownerId };
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

  async getAllFileSharedId(sharedId: string) {
    const files = await this.model
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
    if (!files) {
      throw new NotFoundException('Get file failed !');
    }
    return {
      data: files,
      statusCode: 200,
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
    const files = await this.getAllFileOwnerIdAndParentId(ownerId);
    return {
      data: files,
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
          ownerId,
        },
        { $addToSet: { sharedIds: sharedIds } },
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
      throw new NotFoundException('Shared failed !');
    }
    return {
      statusCode: 200,
      data: file,
      message: 'Shared successfully !',
    };
  }

  async removePermissionsFolder(
    fileId: string,
    ownerId: string,
    userId: string,
  ) {
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
}
