import { IsEmail, IsString } from 'class-validator';

export class VerifyOtpDto {
  @IsString()
  tempId: string;

  @IsString()
  otp: string;
}
