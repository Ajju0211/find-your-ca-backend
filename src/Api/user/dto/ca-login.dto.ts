import { IsEmail, IsString } from 'class-validator';

export class CaLoginDto {
  @IsString()
  role: 'ca'; // literal type

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString()
  password: string;
}
