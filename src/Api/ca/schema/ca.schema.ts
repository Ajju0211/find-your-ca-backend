import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CaDocument = Ca & Document;

@Schema({ timestamps: true })
export class Ca {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, min: 0, max: 5 })
  rating: number;

  @Prop({ required: true })
  experience: string; // Changed from number → string (e.g., "8 years")

  @Prop({ type: [String], required: true })
  specialties: string[];

  @Prop({ required: true })
  highlight: string;

  @Prop({
    type: {
      profile: { type: String },
      contact: { type: String },
    },
    required: false,
  })
  button?: {
    profile?: string;
    contact?: string;
  };
}

export const CaSchema = SchemaFactory.createForClass(Ca);
