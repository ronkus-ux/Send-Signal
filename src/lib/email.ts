import nodemailer from 'nodemailer';

export async function sendPasswordResetEmail(to: string, resetLink: string) {
  const host = process.env.SMTP_HOST || 'localhost';
  const port = parseInt(process.env.SMTP_PORT || '1025', 10);
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';
  const from = process.env.SMTP_FROM || 'Send Signal <noreply@sendsignal.io>';

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for port 465, false for other ports
    auth: user || pass ? { user, pass } : undefined,
  });

  const mailOptions = {
    from,
    to,
    subject: 'Reset your password',
    text: `To reset your password, please visit the following link: ${resetLink}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #dbdbdb; border-radius: 8px; background-color: #ffffff;">
        <h2 style="font-size: 20px; font-weight: 700; color: #1f1f1f; margin-bottom: 12px; margin-top: 0;">Reset your password</h2>
        <p style="font-size: 14px; color: #4c4c4c; line-height: 20px; margin-bottom: 24px;">
          Click the button below to reset the password for your Send Signal account.
        </p>
        <div style="margin-bottom: 24px;">
          <a href="${resetLink}" style="display: inline-block; background-color: #037ce6; color: #ffffff; padding: 10px 20px; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 8px; text-align: center;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 12px; color: #808080; margin-top: 24px; border-top: 1px solid #dbdbdb; padding-top: 16px; margin-bottom: 0;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending password reset email via SMTP:', error);
    throw error;
  }
}
