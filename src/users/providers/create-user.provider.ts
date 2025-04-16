import {
  forwardRef,
  Inject,
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/mail.service';
import { TokenService } from 'src/auth/providers/tokens.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingProvider,
    private readonly mailService: MailService,
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;
    try {
      existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });
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
        createUserDto.password,
      );

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      await this.userRepository.save(newUser);

      const token = await this.tokenService.generateEmailToken(newUser.id);
      console.log('Generated token:', token);
      await this.mailService.sendVerificationEmail(newUser.email, token);

      return {
        message: 'User created successfully',
        user: newUser, // Optionally return user data
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Unable to send verification email',
      );
    }
  }
}
