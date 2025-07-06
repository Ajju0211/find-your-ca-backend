import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() dto: CreateUserDto) {
    return this.userService.signup(dto);
  }

  @Post('login')
  login(@Body('phone') phone: string) {
    return this.userService.login(phone);
  }
}
