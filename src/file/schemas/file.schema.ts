import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type FileDocument = HydratedDocument<File>;

@Schema({
  timestamps: true,
})
export class File {
  @Prop()
  url: string;
  @Prop()
  ownerId: string;
  @Prop()
  type?: string;
  @Prop()
  sharedId: string[];
}
export const UsersSchema = SchemaFactory.createForClass(File);
