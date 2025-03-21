import { Module } from '@nestjs/common';
import { HashingProvider } from './providers/hashing.provider';
import { SignInService } from './providers/sign-in.service';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule],
  providers: [HashingProvider, SignInService],
    exports: [HashingProvider, SignInService],
})
export class AuthModule {}
