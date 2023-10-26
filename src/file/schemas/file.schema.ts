import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type FileDocument = HydratedDocument<File>;

@Schema({
  timestamps: true,
})
export class File {
  @Prop()
  ggId: string;
  @Prop()
  fileExtension: string;
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
  @Prop()
  sharedId: string[];
  @Prop()
  ownerId: string;
  @Prop()
  parentId: string;
}
export const FileSchema = SchemaFactory.createForClass(File);
