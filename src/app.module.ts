import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';


@Module({
  // connection of the dataBase
  imports: [
    UsersModule,
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
      type: 'postgres',
      host: config.get('database.host'),
      port: config.get<number>('database.port'),
      username: 'postgres',
      password: config.get<string>('database.password')||"password",
      database: config.get('database.name'),
      autoLoadEntities: true,
      synchronize: true,
    })
  }),
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
