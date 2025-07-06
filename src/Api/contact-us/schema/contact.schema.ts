import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ required: true })
  message: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
