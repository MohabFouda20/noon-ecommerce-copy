import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
    imports:[MailerModule.forRootAsync({
        inject:[ConfigService],
        useFactory:(config:ConfigService)=>{
            return{
                transport:{
                    host:config.get<string>('mail.host'),
                    port:config.get<number>('mail.port'),
                    secure:false,
                    auth:{
                        user:config.get<string>('mail.user'),
                        pass:config.get<string>('mail.password'),
                    }
                },
                template:{
                    dir:__dirname+'/templates',
                    adapter: require('handlebars'),
                    options:{
                        strict:true,
                    },
                }

            }
        }
    })],
})
export class MailModule {}
