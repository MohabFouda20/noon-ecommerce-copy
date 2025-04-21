import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);


  public async sendVerificationEmail(to: string, token: string) {
    const url = `http://localhost:3000/auth/verify?token=${token}`;

    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      text: 'Please verify your email address',
      to: to,
      subject: 'Verification Email',
      html: `
<head>
  <meta charset="utf-8">
  <title>Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .header {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 5px 5px 0 0;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      letter-spacing: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Thank you for registering. Please verify your email address to continue.</p>
      <p>Or click the button below to verify your email address:</p>
      <p><a href='${url}' class="button">Verify Email</a></p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  </div>
</body>
`,
    });

    if (error) {
      console.log(error);
    }
    console.log(data);
  }

  public async sendResetPasswordEmail(to: string, token: string) {
    const url = `http://localhost/auth/reset-password?token=${token}`;
    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: to,
      subject: 'Reset Password',
      text: 'reset password',
      html: `
<head>
  <meta charset="utf-8">
  <title>Reset Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .header {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 5px 5px 0 0;
      text-align: center;
    }
    .content {
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reset Your Password</h1>
    </div>
    <div class="content">
      <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
      <p>To reset your password, click the button below:</p>
      <p><a href='${url}' class="button">Reset Password</a></p>
      <p>This link will expire in 1 hour for security reasons.</p>
      <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
      <p>${url}</p>
    </div>
  </div>
      </body>
      `,
    })
    if(error){
      console.log(error);
    }
    console.log(data);
  }
}
