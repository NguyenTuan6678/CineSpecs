import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name)
    private readonly movieModel: Model<MovieDocument>,
  ) {}

  async findAll(status?: 'NOW_PLAYING' | 'UPCOMING' | 'ARCHIVED'): Promise<Movie[]> {
    const filter: any = status ? { status } : { status: 'NOW_PLAYING' };
    return this.movieModel.find(filter).sort({ releaseDate: -1 }).exec();
  }

  async findBySlug(slug: string): Promise<Movie> {
    const movie = await this.movieModel.findOne({ slug }).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with slug "${slug}" not found`);
    }
    return movie;
  }

  async findById(id: string): Promise<Movie> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid Movie ID: "${id}"`);
    }
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with ID "${id}" not found`);
    }
    return movie;
  }

  async voteAfterCredit(movieId: string): Promise<Movie> {
    if (!Types.ObjectId.isValid(movieId)) {
      throw new NotFoundException(`Invalid Movie ID: "${movieId}"`);
    }
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      throw new NotFoundException(`Movie with ID "${movieId}" not found`);
    }

    movie.afterCreditVotes += 1;
    // Set hasAfterCredit to true once there are at least 3 votes
    if (movie.afterCreditVotes >= 3) {
      movie.hasAfterCredit = true;
    }

    return movie.save();
  }
}
