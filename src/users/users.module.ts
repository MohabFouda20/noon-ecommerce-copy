import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserProvider } from './providers/create-user.provider';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User]) ],
  controllers: [UsersController],
  providers: [UsersService , CreateUserProvider , HashingProvider],
  exports: [UsersService],
})
export class UsersModule {}
