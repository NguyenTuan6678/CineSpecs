import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { UsersService } from '../users/users.service';
import { MoviesService } from '../movies/movies.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
  ) {}

  async create(data: {
    userId: string;
    movieId: string;
    storyScore: number;
    visualScore: number;
    actingScore: number;
    content: string;
    hasSpoiler?: boolean;
  }): Promise<Review> {
    // Validate User & Movie
    await this.usersService.findById(data.userId);
    await this.moviesService.findById(data.movieId);

    const averageScore = Number(((data.storyScore + data.visualScore + data.actingScore) / 3).toFixed(2));

    const review = new this.reviewModel({
      userId: new Types.ObjectId(data.userId),
      movieId: new Types.ObjectId(data.movieId),
      storyScore: data.storyScore,
      visualScore: data.visualScore,
      actingScore: data.actingScore,
      averageScore,
      content: data.content,
      hasSpoiler: data.hasSpoiler || false,
      isReported: false,
      reportCount: 0,
    });

    return (await review.save()).populate('userId');
  }

  async findByMovieId(movieId: string): Promise<Review[]> {
    if (!Types.ObjectId.isValid(movieId)) {
      return [];
    }
    // Return non-reported reviews (or reports <= 5)
    return this.reviewModel
      .find({
        movieId: new Types.ObjectId(movieId),
        isReported: { $ne: true },
      })
      .populate('userId')
      .sort({ createdAt: -1 })
      .exec();
  }

  async reportReview(reviewId: string): Promise<Review> {
    if (!Types.ObjectId.isValid(reviewId)) {
      throw new NotFoundException(`Invalid Review ID: "${reviewId}"`);
    }
    const review = await this.reviewModel.findById(reviewId).exec();
    if (!review) {
      throw new NotFoundException(`Review with ID "${reviewId}" not found`);
    }

    review.reportCount += 1;
    if (review.reportCount > 5) {
      review.isReported = true;
    }

    return review.save();
  }
}
