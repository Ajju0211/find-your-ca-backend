import { IsEmail, IsNumber, IsString } from 'class-validator';

export class Step3Dto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  // ... other optional fields

  @IsString()
  tempId: string;

  @IsNumber()
  form_step_progress: number;
}
