import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SignInService } from './auth/providers/sign-in.service';
import { AuthModule } from './auth/auth.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, SignInService],
})
export class AppModule {
}
