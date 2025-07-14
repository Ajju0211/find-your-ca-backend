import { IsOptional, IsString, Matches } from 'class-validator';
import { Role } from 'src/enum/enum';

export class UserLoginDto {

  @IsString()
  role: Role.USER; // literal type

  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be a valid 10-digit number' })
  phone: string;
}
