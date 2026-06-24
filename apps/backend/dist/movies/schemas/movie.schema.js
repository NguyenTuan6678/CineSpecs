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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieSchema = exports.Movie = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Movie = class Movie {
    tmdbId;
    title;
    slug;
    posterUrl;
    overview;
    releaseDate;
    status;
    hasAfterCredit;
    afterCreditVotes;
};
exports.Movie = Movie;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, type: Number, index: true }),
    __metadata("design:type", Number)
], Movie.prototype, "tmdbId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, trim: true, index: true }),
    __metadata("design:type", String)
], Movie.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Movie.prototype, "posterUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Movie.prototype, "overview", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], Movie.prototype, "releaseDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['NOW_PLAYING', 'UPCOMING', 'ARCHIVED'],
        default: 'NOW_PLAYING',
        index: true,
    }),
    __metadata("design:type", String)
], Movie.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Movie.prototype, "hasAfterCredit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, default: 0 }),
    __metadata("design:type", Number)
], Movie.prototype, "afterCreditVotes", void 0);
exports.Movie = Movie = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'movies',
    })
], Movie);
exports.MovieSchema = mongoose_1.SchemaFactory.createForClass(Movie);
//# sourceMappingURL=movie.schema.js.map