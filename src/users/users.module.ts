import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserProvider } from './providers/create-user.provider';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/mail/mail.module';
import { OtpProvider } from './providers/otp.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])  ,forwardRef(()=>AuthModule), MailModule],
  controllers: [UsersController],
  providers: [UsersService , CreateUserProvider , HashingProvider, OtpProvider, ],
  exports: [UsersService,OtpProvider],
})
export class UsersModule {}
