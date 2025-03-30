import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignUpDto } from '../dtos/sign-up.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SignUpProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingService: HashingProvider,
    private readonly mailService: MailerService,
  ) {}
  public async signUp(signUpDto: SignUpDto) {
    return this.usersService.signUp(signUpDto)
  }
}
