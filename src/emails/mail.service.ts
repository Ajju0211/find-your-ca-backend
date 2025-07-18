import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { sendEmail } from 'src/utils/email.util';
import { SendOtpDto } from './dto/send-otp.dto';
import { Ca, CaDocument } from 'src/Api/ca/schema/ca.schema';
import { emailVerificationTemplate } from 'src/templates/emailVerification.template';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { randomInt } from 'crypto';

@Injectable()
export class EmailService {
  constructor(@InjectModel(Ca.name) private caModel: Model<CaDocument>) {}

  async sendEmailOtp({ tempId, email }: SendOtpDto) {
    const emailExists = await this.caModel.findOne({ email });
    if (emailExists) throw new ConflictException('Email already exits');
    const ca = await this.caModel.findOne({ tempId });
    if (!ca) throw new NotFoundException('CA not found');
    // Strong, secure 6-digit OTP
    const otp = randomInt(100000, 999999).toString(); // 6-digit, non-predictable
    ca.email = email;
    ca.emailOtp = otp;
    ca.emailOtpExpiresAt = new Date(Date.now() + 1 * 60 * 3000); // 3 minute
    ca.emailOtpRequestedAt = new Date();
    console.log(ca);
    await ca.save();

    await sendEmail({
      to: email,
      subject: 'Verify your email - Find Your CA',
      html: emailVerificationTemplate({
        otp,
      }),
    });

    return { message: 'OTP sent successfully' };
  }

  async verifyEmailOtp({ tempId, otp }: VerifyOtpDto) {
    const ca = await this.caModel.findOne({ tempId });
    console.log('Ca Verfiying info: ', ca);
    if (!ca) throw new NotFoundException('CA not found');

    if (ca.emailVerified) throw new BadRequestException('Already verified');
    const isExpired =
      !ca.emailOtpExpiresAt || ca.emailOtpExpiresAt < new Date();
    if (ca.emailOtp !== otp || isExpired) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    ca.emailVerified = true;
    ca.emailOtp = undefined;
    ca.emailOtpExpiresAt = undefined;
    ca.emailOtpRequestedAt = undefined;
    await ca.save();

    return { message: 'Email verified successfully' };
  }
}
