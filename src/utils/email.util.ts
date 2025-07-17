import * as nodemailer from 'nodemailer';
import validator from 'validator'; // ⬅️ Make sure you've installed this with `npm i validator`

interface SendEmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

/**
 * Sends an email using nodemailer.
 *
 * @param to - Recipient email address
 * @param subject - Subject line
 * @param text - Plain text content
 * @param html - HTML content
 * @param from - Optional sender email
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const sender = process.env.EMAIL_USER;

  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✓ loaded' : '✗ missing');

  // ✅ Validate recipient email format
  if (!validator.isEmail(to)) {
    throw new Error(`Invalid recipient email: ${to}`);
  }

  if (!sender || !to || !subject || (!text && !html)) {
    throw new Error('Invalid email parameters');
  }

  try {
    const info = await transporter.sendMail({
      from: sender,
      to,
      subject,
      text,
      html,
    });

    console.log(`[Email] Sent to ${to}: ${info.response}`);
  } catch (error: any) {
    console.error(`[Email] Failed to send to ${to}:`, error?.message || error);
    throw new Error('Email sending failed');
  }
}
