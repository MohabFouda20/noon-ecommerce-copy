import { forwardRef, Module } from '@nestjs/common';
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
import { VerifyByTokenProvider } from './providers/verify-by-token.provider';
import jwtConfig from './config/jwt.config';
import { MailModule } from 'src/mail/mail.module';
import { ForgetPasswordProvider } from './providers/forget-password.provider';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MailModule,
    ConfigModule.forRoot({ load: [jwtConfig], isGlobal: true }), // ✅ Ensure ConfigModule is loaded globally
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.accessTokenTTL'),
        },
      }),
    }),
  ],
  providers: [
    HashingProvider,
    AuthService,
    SignInProvider,
    TokenService,
    LogOutProvider,
    SignUpProvider,
    VerifyByTokenProvider,
    ForgetPasswordProvider,
  ],
  exports: [HashingProvider, AuthService, JwtModule, TokenService],
  controllers: [AuthController],
})
export class AuthModule {}
