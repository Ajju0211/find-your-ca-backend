import { Controller, Post, Body } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  async sendOtp(@Body('phone') phone: string) {
    return this.otpService.sendOtp(phone);
  }

  @Post('verify')
  async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
    return this.otpService.verifyOtp(phone, otp);
  }
}
