import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Users } from '~/users/schemas/users.schema';
import { Folder } from '~/folders/schemas/folders.schema';

export type FileDocument = HydratedDocument<File>;

@Schema({
  timestamps: true,
  toObject: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.ownerId;
      delete ret.parentId;
      delete ret.sharedIds;
      return ret;
    },
  },
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.ownerId;
      delete ret.parentId;
      delete ret.sharedIds;
      return ret;
    },
  },
})
export class File {
  @Prop()
  ggId: string;

  @Prop()
  fileExtension: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
  })
  startIds?: mongoose.Schema.Types.ObjectId[];
  @Prop()
  title: string;

  @Prop()
  webContentLink: string;

  @Prop()
  fileSize: number;

  @Prop()
  thumbnailLink: string;

  @Prop()
  iconLink: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
  })
  sharedIds?: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Users.name,
  })
  ownerId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  parentId?: string;
}
const FileSchema = SchemaFactory.createForClass(File);
FileSchema.virtual('parent', {
  ref: Folder.name,
  localField: 'parentId',
  foreignField: '_id',
  justOne: true,
});
FileSchema.virtual('shared', {
  ref: Users.name,
  localField: 'sharedIds',
  foreignField: '_id',
});
FileSchema.virtual('owner', {
  ref: Users.name,
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});
export { FileSchema };
