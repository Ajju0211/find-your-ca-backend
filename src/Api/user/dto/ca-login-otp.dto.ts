import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CaLoginOtpDto {
  @IsNotEmpty()
  @IsString()
  role: string;

  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phone: string;

  @IsOptional()
  otp: string;
}
