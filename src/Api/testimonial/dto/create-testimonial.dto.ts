import { IsString, IsOptional } from 'class-validator';

export class CreateTestimonialDto {
  @IsString()
  quote: string;

  @IsOptional()
  @IsString()
  highlight?: string;

  @IsString()
  name: string;

  @IsString()
  designation: string;

  @IsString()
  image: string; // This will be the image URL
}
