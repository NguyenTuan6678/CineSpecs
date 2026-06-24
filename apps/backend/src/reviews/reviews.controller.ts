import { Controller, Post, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async createReview(
    @Body()
    body: {
      userId: string;
      movieId: string;
      storyScore: number;
      visualScore: number;
      actingScore: number;
      content: string;
      hasSpoiler?: boolean;
    },
  ): Promise<Review> {
    return this.reviewsService.create(body);
  }

  @Post(':reviewId/report')
  async reportReview(@Param('reviewId') reviewId: string): Promise<Review> {
    return this.reviewsService.reportReview(reviewId);
  }
}
