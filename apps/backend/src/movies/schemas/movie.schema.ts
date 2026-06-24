import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({
  timestamps: true,
  collection: 'movies',
})
export class Movie {
  @Prop({ required: true, unique: true, type: Number, index: true })
  tmdbId: number;

  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, trim: true, index: true })
  slug: string;

  @Prop({ trim: true })
  posterUrl: string;

  @Prop({ trim: true })
  overview: string;

  @Prop({ trim: true })
  releaseDate: string;

  @Prop({
    required: true,
    enum: ['NOW_PLAYING', 'UPCOMING', 'ARCHIVED'],
    default: 'NOW_PLAYING',
    index: true,
  })
  status: 'NOW_PLAYING' | 'UPCOMING' | 'ARCHIVED';

  @Prop({ required: true, type: Boolean, default: false })
  hasAfterCredit: boolean;

  @Prop({ required: true, type: Number, default: 0 })
  afterCreditVotes: number;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
