import { env } from '@/config/env';

interface SendOtpEmailOptions {
  to: string;
  name: string;
  otp: string;
}

/**
 * Sends a password reset OTP code email using the Resend API if RESEND_API_KEY is set.
 * Falls back to logging to console if API key is not yet configured.
 */
export async function sendOtpEmail({ to, name, otp }: SendOtpEmailOptions): Promise<void> {
  const resendApiKey = process.env.RESEND_API_KEY || env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL || process.env.CONTACT_FROM_KEYS || env.EMAIL_FROM || 'Nimbus CRM <onboarding@resend.dev>';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6; margin: 0; padding: 40px 20px; }
          .container { max-width: 500px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
          .logo { font-size: 20px; font-weight: 700; color: #6366f1; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }
          h1 { font-size: 22px; font-weight: 600; color: #ffffff; margin-top: 0; margin-bottom: 8px; }
          p { font-size: 14px; color: #9ca3af; line-height: 1.6; margin-bottom: 24px; }
          .otp-box { background-color: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px; }
          .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #818cf8; }
          .footer { font-size: 12px; color: #6b7280; text-align: center; border-top: 1px solid #1f2937; pt: 16px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">⚡ Nimbus CRM</div>
          <h1>Password Reset Request</h1>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password for your Nimbus CRM workspace. Use the 6-digit verification code below to complete your password reset:</p>
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
          </div>
          <p>This OTP code will expire in <strong>15 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Nimbus CRM. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject: `${otp} is your Nimbus CRM password reset code`,
          html: htmlContent,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Resend API Error:', errorText);
      } else {
        console.log(`✉️ Password reset OTP (${otp}) successfully sent via Resend to ${to}`);
      }
    } catch (error) {
      console.error('❌ Failed to send email via Resend:', error);
    }
  } else {
    console.log(`ℹ️ [DEV MODE] Resend API key not set in .env. Password Reset OTP for ${to}: ${otp}`);
  }
}
