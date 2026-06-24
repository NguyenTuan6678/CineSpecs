import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ReviewsService } from '../reviews/reviews.service';
import { Movie } from './schemas/movie.schema';
import { Review } from '../reviews/schemas/review.schema';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  async getMovies(
    @Query('status') status?: 'NOW_PLAYING' | 'UPCOMING' | 'ARCHIVED',
  ): Promise<Movie[]> {
    return this.moviesService.findAll(status);
  }

  @Get(':slug')
  async getMovieBySlug(@Param('slug') slug: string): Promise<Movie> {
    return this.moviesService.findBySlug(slug);
  }

  @Post(':movieId/after-credit')
  async voteAfterCredit(@Param('movieId') movieId: string): Promise<Movie> {
    return this.moviesService.voteAfterCredit(movieId);
  }

  @Get(':movieId/reviews')
  async getMovieReviews(@Param('movieId') movieId: string): Promise<Review[]> {
    return this.reviewsService.findByMovieId(movieId);
  }
}
