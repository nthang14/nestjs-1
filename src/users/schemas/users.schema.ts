import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
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
  password: string;
}
export const UsersSchema = SchemaFactory.createForClass(Users);
