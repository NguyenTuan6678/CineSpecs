import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { SyncService } from './sync.service';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { ReviewsModule } from '../reviews/reviews.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
    ]),
    HttpModule,
    forwardRef(() => ReviewsModule),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, SyncService],
  exports: [MoviesService, SyncService],
})
export class MoviesModule {}
