import * as mongoose from 'mongoose';

export class BaseUserDTO {
  fullName: string;
  username: string;
  avatar: string;
  password: string;
  level: number;
  files?: mongoose.Schema.Types.ObjectId[];
}
