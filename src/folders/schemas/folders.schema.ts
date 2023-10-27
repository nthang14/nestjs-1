import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Users } from '~/users/schemas/users.schema';
export type FolderDocument = HydratedDocument<Folder>;

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
export class Folder {
  @Prop()
  title: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
  })
  sharedIds?: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  ownerId: mongoose.Schema.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
  })
  parentId?: mongoose.Schema.Types.ObjectId;
}

const FolderSchema = SchemaFactory.createForClass(Folder);
FolderSchema.virtual('parent', {
  ref: Folder.name,
  localField: 'parentId',
  foreignField: '_id',
  justOne: true,
});
FolderSchema.virtual('shared', {
  ref: Users.name,
  localField: 'sharedIds',
  foreignField: '_id',
});
FolderSchema.virtual('owner', {
  ref: Users.name,
  localField: 'ownerId',
  foreignField: '_id',
  justOne: true,
});
export { FolderSchema };
