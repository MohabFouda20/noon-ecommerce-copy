import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignUpDto } from '../dtos/sign-up.dto';

@Injectable()
export class SignUpProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingProvider,
  ) {}
  public async signUp(signUpDto: SignUpDto) {
    return this.usersService.signUp(signUpDto)
  }
}
