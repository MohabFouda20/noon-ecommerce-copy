import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASS,
                    },
                },
                template: {
                    dir: join(__dirname, '..', '..', 'src', 'mail', 'templates'), // Adjust this path
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
                defaults: {
                    from: 'fouda.hoba@gmail.com', // will change it later 
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService], 
})
export class MailModule {}
