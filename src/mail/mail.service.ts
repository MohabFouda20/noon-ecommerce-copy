import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  public async sendVerificationEmail(to: string, token: string ,otp:string) {
    const url = `http://localhost:3000/auth/verify?token=${token}`;
    await this.mailService.sendMail({
      to: to,
      subject: 'Verification Email',
      template: 'verification-email',
      context: {
        url,
        otp,
      },
    });
  }
  public async sendResetPasswordEmail(to: string, otp:string) {
    await this.mailService.sendMail({
      to: to,
      subject: 'Reset Password',
      template: 'reset-password',
      context: {
        otp,
      },
    });
  }
}
