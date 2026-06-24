import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User {
  @Prop({ required: true, unique: true, trim: true, index: true })
  email: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  avatar: string;

  @Prop({ required: true, enum: ['USER', 'ADMIN'], default: 'USER' })
  role: 'USER' | 'ADMIN';
}

export const UserSchema = SchemaFactory.createForClass(User);
