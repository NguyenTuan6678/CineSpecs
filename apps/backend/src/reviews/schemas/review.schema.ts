import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({
  timestamps: true,
  collection: 'reviews',
})
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Movie', required: true, index: true })
  movieId: Types.ObjectId;

  @Prop({ required: true, type: Number, min: 1, max: 10 })
  storyScore: number; // 1-10 rating

  @Prop({ required: true, type: Number, min: 1, max: 10 })
  visualScore: number; // 1-10 rating

  @Prop({ required: true, type: Number, min: 1, max: 10 })
  actingScore: number; // 1-10 rating

  @Prop({ required: true, type: Number })
  averageScore: number; // (storyScore + visualScore + actingScore) / 3

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ type: Boolean, default: false })
  hasSpoiler: boolean;

  @Prop({ type: Boolean, default: false, index: true })
  isReported: boolean;

  @Prop({ type: Number, default: 0 })
  reportCount: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
