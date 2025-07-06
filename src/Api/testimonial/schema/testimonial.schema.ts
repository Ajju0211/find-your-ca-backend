import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TestimonialDocument = Testimonial & Document;

@Schema({ timestamps: true })
export class Testimonial {
  @Prop({ required: true })
  quote: string;

  @Prop({ required: false }) // Optional highlighted word
  highlight?: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  designation: string;

  @Prop({ required: true }) // URL to image
  image: string;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
