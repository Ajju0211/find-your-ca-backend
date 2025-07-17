import { Body, Controller, Post } from '@nestjs/common';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EmailService } from './mail.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-otp')
  async sendEmailOtp(@Body() dto: SendOtpDto) {
    return this.emailService.sendEmailOtp(dto);
  }

  @Post('verify-otp')
  async verifyEmailOtp(@Body() dto: VerifyOtpDto) {
    return this.emailService.verifyEmailOtp(dto);
  }
}
