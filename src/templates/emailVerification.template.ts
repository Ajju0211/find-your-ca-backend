export function emailVerificationTemplate({ otp }: { otp: string }): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <p style="font-size: 18px; color: #1a202c; margin-bottom: 12px;">

      </p>

      <h2 style="color: #4f46e5; margin-top: 0;">Verify your email - Find Your CA</h2>

      <p style="font-size: 15px; color: #444;">
        Thank you for signing up with <strong>Find Your CA</strong> — India’s trusted platform to discover and connect with top Chartered Accountants.
      </p>

      <p style="font-size: 16px; font-weight: 500; color: #000; margin: 20px 0;">
        Your one-time verification code is:
      </p>

      <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1a202c; text-align: center; margin: 20px 0;">
        ${otp}
      </div>

      <p style="font-size: 14px; color: #555;">
        This code will expire in <strong>3 minutes</strong>. Please don’t share it with anyone.
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />

      <p style="font-size: 13px; color: #888;">
        If you didn’t create an account on Find Your CA, you can safely ignore this email.
      </p>

      <p style="font-size: 13px; color: #888;">– The Find Your CA Team</p>
    </div>
  `;
}
