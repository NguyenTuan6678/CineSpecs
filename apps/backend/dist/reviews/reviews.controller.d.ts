import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    createReview(body: {
        userId: string;
        movieId: string;
        storyScore: number;
        visualScore: number;
        actingScore: number;
        content: string;
        hasSpoiler?: boolean;
    }): Promise<Review>;
    reportReview(reviewId: string): Promise<Review>;
}
