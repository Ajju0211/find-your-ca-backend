// src/reviews/dto/create-review.dto.ts
import {
  IsMongoId,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsArray,
} from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  ca: string;

  @IsMongoId()
  user: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsArray()
  @IsOptional()
  services?: string[];

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}
