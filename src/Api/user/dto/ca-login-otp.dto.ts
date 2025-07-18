import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CaLoginOtpDto {
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phone: string;

  @IsNotEmpty()
  otp: string;
}
