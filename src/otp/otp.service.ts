import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class OtpService {
  private API_URL = 'https://www.fast2sms.com/dev/bulkV2';
  private API_KEY = process.env.FAST2SMS_API_KEY;
  private SENDER_ID = process.env.FAST2SMS_SENDER_ID; 
  private TEMPLATE_ID = process.env.FAST2SMS_TEMPLATE_ID;

  private otpStorage = new Map<string, string>(); // Temporary storage

  // Generate a Random 6-digit OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Convert to string
  }

  // Send OTP via Fast2SMS
  async sendOtp(phone: string): Promise<{ success: boolean; message: string; otp?: string }> {
    console.log("phone", phone)
    if (!phone) {
      return { success: false, message: 'Phone number is required' };
    }

    const otp = this.generateOtp();
    this.otpStorage.set(phone, otp); // Store OTP temporarily

    try {
      const response = await axios.get(this.API_URL, {
        params: {
          authorization: this.API_KEY,
          route: 'dlt',
          sender_id: this.SENDER_ID,
          message: this.TEMPLATE_ID,
          variables_values: otp,
          flash: 0,
          numbers: phone,
        },
      });

      console.log('Fast2SMS Response:', response.data);
      return { success: true, message: 'OTP sent successfully!' };
    } catch (error) {
      console.error('Error sending OTP:', error.response?.data || error.message);
      return { success: false, message: 'Failed to send OTP. Try again later.' };
    }
  }

  // Verify OTP
  async verifyOtp(phone: string, enteredOtp: string): Promise<{ success: boolean; message: string }> {
    const storedOtp = this.otpStorage.get(phone);

    if (!storedOtp) {
      return { success: false, message: 'OTP expired or not found. Please request a new one.' };
    }

    if (storedOtp === enteredOtp) {
      this.otpStorage.delete(phone); // Remove OTP after successful verification
      return { success: true, message: 'OTP verified successfully!' };
    } else {
      return { success: false, message: 'Invalid OTP. Please try again.' };
    }
  }
}
