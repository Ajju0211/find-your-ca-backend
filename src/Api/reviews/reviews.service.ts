// src/reviews/reviews.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument } from './schema/review.schema';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const review = new this.reviewModel(createReviewDto);
    return review.save();
  }

  async findByCa(caId: string) {
    return this.reviewModel
      .find({ ca: caId })
      .populate('user', 'name role profile_image')
      .sort({ createdAt: -1 });
  }
}
