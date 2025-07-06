import { IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @Matches(/^[0-9]{10}$/, {
    message: 'Phone number must be a valid 10-digit number',
  })
  phone: string;
}
