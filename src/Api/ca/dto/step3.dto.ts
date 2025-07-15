import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class Step3Dto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  // ... other optional fields
  @IsOptional()
  @IsString()
  tempId: string;

  @IsNumber()
  form_step_progress: number;
}
