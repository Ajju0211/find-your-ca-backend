import { IsEmail, IsString } from 'class-validator';

export class SendOtpDto {
  @IsString()
  tempId: string;

  @IsEmail()
  email: string;
}
