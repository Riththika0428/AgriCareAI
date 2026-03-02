import nodemailer from 'nodemailer';
import config from '../config/dotenv.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.emailUser,
        pass: config.emailPass
      }
    });
  }

  async sendEmail(options) {
    const mailOptions = {
      from: `"AgriAI" <${config.emailUser}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(email, resetToken) {
    const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #16a34a;">Reset Your Password</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" 
           style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;
    await this.sendEmail({ email, subject: 'Password Reset Request', html });
  }

  async sendWelcomeEmail(user) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #16a34a;">Welcome to AgriAI, ${user.name}! 🌱</h1>
        <p>Thank you for joining AgriAI. Get started by exploring our platform.</p>
        <a href="${config.frontendUrl}/dashboard" 
           style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Go to Dashboard
        </a>
      </div>
    `;
    await this.sendEmail({ email: user.email, subject: 'Welcome to AgriAI!', html });
  }
}

export default new EmailService();