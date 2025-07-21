import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './types/types';
import { CaLoginOtpDto } from './dto/ca-login-otp.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.userService.login(data);
  }
  @Post('login-with-otp')
  loginCAWithOtp(@Body() data: CaLoginOtpDto) {
    return this.userService.loginCAWithOtp(data);
  }
}
