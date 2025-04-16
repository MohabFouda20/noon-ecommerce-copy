import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailService: MailerService) {}

  public async sendVerificationEmail(to: string, token: string) {
    const url = `http://localhost:3000/auth/verify?token=${token}`;
    await this.mailService.sendMail({
      to: to,
      subject: 'Verification Email',
      template: 'verification-email',
      context: {
        url,
      },
    });
  }
  public async sendResetPasswordEmail(to: string, token: string) {
    const url = `http://localhost/auth/reset-password?token=${token}`
    await this.mailService.sendMail({
      to: to,
      subject: 'Reset Password',
      template: 'reset-password',
      context: {
        url,
      },
    });
  }
}
