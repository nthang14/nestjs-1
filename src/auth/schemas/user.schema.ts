import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UsersDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;
  @Prop({ unique: [true, 'Duplicate email entered'] })
  username: string;
  @Prop()
  password: string;
  @Prop()
  refreshToken: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
