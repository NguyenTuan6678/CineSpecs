import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { UsersService } from '../users/users.service';
import { MoviesService } from '../movies/movies.service';
export declare class ReviewsService {
    private readonly reviewModel;
    private readonly usersService;
    private readonly moviesService;
    constructor(reviewModel: Model<ReviewDocument>, usersService: UsersService, moviesService: MoviesService);
    create(data: {
        userId: string;
        movieId: string;
        storyScore: number;
        visualScore: number;
        actingScore: number;
        content: string;
        hasSpoiler?: boolean;
    }): Promise<Review>;
    findByMovieId(movieId: string): Promise<Review[]>;
    reportReview(reviewId: string): Promise<Review>;
}
