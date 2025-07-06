import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateContactDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be a 10-digit number' })
  phone?: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
