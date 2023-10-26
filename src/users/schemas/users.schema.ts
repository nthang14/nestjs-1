import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { File } from '~/file/schemas/file.schema';
export type UsersDocument = HydratedDocument<Users>;

@Schema({
  timestamps: true,
})
export class Users {
  @Prop()
  fullName: string;
  @Prop()
  username: string;
  @Prop()
  avatar: string;
  @Prop()
  password: string;
  @Prop()
  level: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: File.name,
    default: [],
  })
  files: mongoose.Schema.Types.ObjectId[];
}
export const UsersSchema = SchemaFactory.createForClass(Users);
