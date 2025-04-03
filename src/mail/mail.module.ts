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
                    host: config.get<string>('mail.host') || 'smtp.mailtrap.io',
                    port: 2525,
                    secure: false,
                    auth: {
                        user: config.get<string>('mail.user'),
                        pass: config.get<string>('mail.password'),
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
                    from: 'support <no-reply@noon.com>',
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService], 
})
export class MailModule {}
