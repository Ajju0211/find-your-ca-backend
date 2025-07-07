import { Document } from 'mongoose';

export interface Review extends Document {
  ca: string;
  user: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}
