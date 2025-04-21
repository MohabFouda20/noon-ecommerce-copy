import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import { SignUpDto } from '../dtos/sign-up.dto';
import { User } from 'src/users/user.entity';
import { TokenService } from './tokens.service';

import { MailService } from 'src/mail/mail.service';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class SignUpProvider {
  constructor(
    private readonly hashingService: HashingProvider,
    private readonly mailService: MailService,
    private readonly tokenService: TokenService,

    // private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}
  public async signUp(signUpDto: SignUpDto) {
    let existingUser: User | null = null;
    try {
      existingUser = await this.usersService.findOneByEmail(signUpDto.email);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Database query failed. Please try again.',
      );
    }

    if (existingUser) {
      throw new ConflictException('Email already exists. Please log in.');
    }

    try {
      const hashedPassword = await this.hashingService.hashPassword(
        signUpDto.password,
      );
      const user = { ...signUpDto };
      user.password = hashedPassword;
      const newUser = await this.usersService.createUser(user);
      if (newUser) {
        const token = await this.tokenService.generateEmailToken(newUser.id);
        console.log('Generated token:', token);
        await this.mailService.sendVerificationEmail(newUser.email, token);
        return {
          message: 'User created successfully',
          user: newUser, // Optionally return user data
        };
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Unable to send verification email',
      );
    }
  }
}
