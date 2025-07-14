import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/enum/enum';

export class CaLoginDto {
  @IsString()
  role: Role.CA; // literal type

  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString()
  password: string;
}
