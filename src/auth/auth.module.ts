import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashingProvider } from './providers/hashing.provider';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './providers/auth.service';
import { SignInProvider } from './providers/sign-in.provider';
import { TokenService } from './providers/tokens.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { LogOutProvider } from './providers/log-out.provider';
import { SignUpProvider } from './providers/sign-up.provider';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [jwtConfig], isGlobal: true }), // ✅ Ensure ConfigModule is loaded globally
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], 
      inject: [ConfigService],  
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get<string>('jwt.accessTokenTTL') },
      }),
    }),
  ],
  providers: [HashingProvider, AuthService, SignInProvider, TokenService, LogOutProvider, SignUpProvider],
  exports: [HashingProvider, AuthService, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
