import {
  IsMongoId,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class UpdateReviewDto {
  @IsMongoId()
  @IsOptional()
  ca?: string;

  @IsMongoId()
  @IsOptional()
  user?: string;

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
