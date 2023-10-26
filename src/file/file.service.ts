import { InjectModel } from '@nestjs/mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { File, FileDocument } from '~/file/schemas/file.schema';
import { Model } from 'mongoose';
import { CreateFileDTO } from '~/file/dto/create-file.dto';
@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private readonly model: Model<FileDocument>,
  ) {}

  async createFile(filePayload: CreateFileDTO) {
    const file = await this.model.create(filePayload);
    if (!file) {
      throw new NotFoundException('File upload failed');
    }
    return file;
  }

  async getAllFileOwnerId(ownerId: string) {
    const files = await this.model.find({ ownerId: ownerId });
    if (!files) {
      throw new NotFoundException('Get file failed');
    }
    return files;
  }

  async getAllFileSharedId(sharedId: string) {
    const files = await this.model.find({
      sharedId: { $elemMatch: { $in: [sharedId] } },
    });
    if (!files) {
      throw new NotFoundException('Get file failed');
    }
    return files;
  }

  async getFileById(id: string, readerPermissionsId: string) {
    const file = await this.model.findOne({
      $or: [
        { ownerId: { $eq: readerPermissionsId } },
        { sharedId: { $elemMatch: { $in: [readerPermissionsId] } } },
      ],
    });
    if (!file) {
      throw new NotFoundException('Get file failed');
    }
    return file;
  }
}
