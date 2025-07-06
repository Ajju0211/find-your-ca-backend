import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Testimonial, TestimonialDocument } from './schema/testimonial.schema';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';

@Injectable()
export class TestimonialService {
  constructor(
    @InjectModel(Testimonial.name) private readonly model: Model<TestimonialDocument>,
  ) {}

  async create(dto: CreateTestimonialDto): Promise<Testimonial> {
    const testimonial = new this.model(dto);
    return testimonial.save();
  }

  async findAll(): Promise<Testimonial[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async findOne(id: string): Promise<Testimonial> {
    const testimonial = await this.model.findById(id).exec();
    if (!testimonial) throw new NotFoundException('Testimonial not found');
    return testimonial;
  }
}
