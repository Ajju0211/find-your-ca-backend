import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// Tpes & Schema for expert Buttons
class ExpertButtons {
  @Prop()
  profile?: string;

  @Prop()
  contact?: string;
}

//Type & Schema for Each Expert
class Expert {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;

  @Prop({ type: ExpertButtons })
  button?: ExpertButtons;
}

//Blog document type

export type BlogDocument = Blog & Document;

@Schema()
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop()
  slug?: string;

  @Prop()
  rawDataString?: string;

  @Prop({ type: Date })
  dateCreated: Date;

  @Prop([Expert])
  experts: Expert[];

  @Prop()
  metaDescription?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

// Schema Factory

export const BlogSchema = SchemaFactory.createForClass(Blog);
