"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const users_service_1 = require("../users/users.service");
const movies_service_1 = require("../movies/movies.service");
let ReviewsService = class ReviewsService {
    reviewModel;
    usersService;
    moviesService;
    constructor(reviewModel, usersService, moviesService) {
        this.reviewModel = reviewModel;
        this.usersService = usersService;
        this.moviesService = moviesService;
    }
    async create(data) {
        await this.usersService.findById(data.userId);
        await this.moviesService.findById(data.movieId);
        const averageScore = Number(((data.storyScore + data.visualScore + data.actingScore) / 3).toFixed(2));
        const review = new this.reviewModel({
            userId: new mongoose_2.Types.ObjectId(data.userId),
            movieId: new mongoose_2.Types.ObjectId(data.movieId),
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
    async findByMovieId(movieId) {
        if (!mongoose_2.Types.ObjectId.isValid(movieId)) {
            return [];
        }
        return this.reviewModel
            .find({
            movieId: new mongoose_2.Types.ObjectId(movieId),
            isReported: { $ne: true },
        })
            .populate('userId')
            .sort({ createdAt: -1 })
            .exec();
    }
    async reportReview(reviewId) {
        if (!mongoose_2.Types.ObjectId.isValid(reviewId)) {
            throw new common_1.NotFoundException(`Invalid Review ID: "${reviewId}"`);
        }
        const review = await this.reviewModel.findById(reviewId).exec();
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID "${reviewId}" not found`);
        }
        review.reportCount += 1;
        if (review.reportCount > 5) {
            review.isReported = true;
        }
        return review.save();
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        users_service_1.UsersService,
        movies_service_1.MoviesService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map