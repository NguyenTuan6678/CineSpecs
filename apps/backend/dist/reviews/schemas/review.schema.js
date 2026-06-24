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
exports.ReviewSchema = exports.Review = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Review = class Review {
    userId;
    movieId;
    storyScore;
    visualScore;
    actingScore;
    averageScore;
    content;
    hasSpoiler;
    isReported;
    reportCount;
};
exports.Review = Review;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Review.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Review.prototype, "movieId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, min: 1, max: 10 }),
    __metadata("design:type", Number)
], Review.prototype, "storyScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, min: 1, max: 10 }),
    __metadata("design:type", Number)
], Review.prototype, "visualScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number, min: 1, max: 10 }),
    __metadata("design:type", Number)
], Review.prototype, "actingScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Review.prototype, "averageScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Review.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "hasSpoiler", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false, index: true }),
    __metadata("design:type", Boolean)
], Review.prototype, "isReported", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Review.prototype, "reportCount", void 0);
exports.Review = Review = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'reviews',
    })
], Review);
exports.ReviewSchema = mongoose_1.SchemaFactory.createForClass(Review);
//# sourceMappingURL=review.schema.js.map