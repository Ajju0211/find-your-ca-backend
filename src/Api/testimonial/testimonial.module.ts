import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Testimonial, TestimonialSchema } from './schema/testimonial.schema';
import { TestimonialService } from './testimonial.service';
import { TestimonialController } from './testimonial.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Testimonial.name, schema: TestimonialSchema }]),
  ],
  controllers: [TestimonialController],
  providers: [TestimonialService],
})
export class TestimonialModule {}
