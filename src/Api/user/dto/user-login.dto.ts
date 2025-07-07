import { IsString, Matches } from 'class-validator';

export class UserLoginDto {
  @IsString()
  role: 'user'; // literal type

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be a valid 10-digit number' })
  phone: string;
}
