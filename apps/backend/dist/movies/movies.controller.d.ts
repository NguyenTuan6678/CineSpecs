import { MoviesService } from './movies.service';
import { ReviewsService } from '../reviews/reviews.service';
import { Movie } from './schemas/movie.schema';
import { Review } from '../reviews/schemas/review.schema';
export declare class MoviesController {
    private readonly moviesService;
    private readonly reviewsService;
    constructor(moviesService: MoviesService, reviewsService: ReviewsService);
    getMovies(status?: 'NOW_PLAYING' | 'UPCOMING' | 'ARCHIVED'): Promise<Movie[]>;
    getMovieBySlug(slug: string): Promise<Movie>;
    voteAfterCredit(movieId: string): Promise<Movie>;
    getMovieReviews(movieId: string): Promise<Review[]>;
}
