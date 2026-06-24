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
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const movie_schema_1 = require("./schemas/movie.schema");
let MoviesService = class MoviesService {
    movieModel;
    constructor(movieModel) {
        this.movieModel = movieModel;
    }
    async findAll(status) {
        const filter = status ? { status } : { status: 'NOW_PLAYING' };
        return this.movieModel.find(filter).sort({ releaseDate: -1 }).exec();
    }
    async findBySlug(slug) {
        const movie = await this.movieModel.findOne({ slug }).exec();
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with slug "${slug}" not found`);
        }
        return movie;
    }
    async findById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException(`Invalid Movie ID: "${id}"`);
        }
        const movie = await this.movieModel.findById(id).exec();
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with ID "${id}" not found`);
        }
        return movie;
    }
    async voteAfterCredit(movieId) {
        if (!mongoose_2.Types.ObjectId.isValid(movieId)) {
            throw new common_1.NotFoundException(`Invalid Movie ID: "${movieId}"`);
        }
        const movie = await this.movieModel.findById(movieId).exec();
        if (!movie) {
            throw new common_1.NotFoundException(`Movie with ID "${movieId}" not found`);
        }
        movie.afterCreditVotes += 1;
        if (movie.afterCreditVotes >= 3) {
            movie.hasAfterCredit = true;
        }
        return movie.save();
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(movie_schema_1.Movie.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MoviesService);
//# sourceMappingURL=movies.service.js.map