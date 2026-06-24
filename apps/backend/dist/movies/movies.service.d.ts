import { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
export declare class MoviesService {
    private readonly movieModel;
    constructor(movieModel: Model<MovieDocument>);
    findAll(status?: 'NOW_PLAYING' | 'UPCOMING' | 'ARCHIVED'): Promise<Movie[]>;
    findBySlug(slug: string): Promise<Movie>;
    findById(id: string): Promise<Movie>;
    voteAfterCredit(movieId: string): Promise<Movie>;
}
