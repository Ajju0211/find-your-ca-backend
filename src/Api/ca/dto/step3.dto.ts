import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class Step3Dto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  tempId: string;

  @IsNumber()
  form_step_progress: number;
}
