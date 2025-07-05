import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateCaDto {
  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsNumber()
  rating: number;

  @IsString()
  experience: string;

  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @IsString()
  highlight: string;
}
