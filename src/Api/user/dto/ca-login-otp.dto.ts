import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CaLoginOtpDto {
  @IsNotEmpty()
  @IsString()
  role: string;
  
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phone: string;

  @IsNotEmpty()
  otp: string;
}
