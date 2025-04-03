import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { MailService } from 'src/mail/mail.service';
import { TokenService } from 'src/auth/providers/tokens.service';
import { OtpProvider } from './otp.provider';
import { retry } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly createUserProvider: CreateUserProvider,
    private readonly hashingProvider: HashingProvider,
    private readonly otpProvider: OtpProvider,
    @Inject(forwardRef(() => TokenService))
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  public async signUp(createUserDto: CreateUserDto) {
    return this.createUserProvider.createUser(createUserDto);
  }

  public async findOneByEmail(email: string) {
    let user: User | null = null;
    try {
      user = await this.userRepository.findOneBy({ email: email });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Database query failed. Please try again.',
      );
    }
    return user;
  }

  public async findOneById(id: number) {
    let user: User | null = null;
    try {
      user = await this.userRepository.findOneBy({ id: id });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Database query failed. Please try again.',
      );
    }
    if (!user) {
      throw new RequestTimeoutException('User not found. Please register.');
    }
    return user;
  }

  public async updateUser(user: User) {
    try {
      const existingUser = await this.findOneById(user.id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Merge changes and save
      const updatedUser = Object.assign(existingUser, user);
      await this.userRepository.save(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
  public async deleteUser(id: number) {
    try {
      const user = await this.findOneById(id);
      if (!user) {
        throw new Error('User not found');
      }

      await this.userRepository.delete(user.id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  public async createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto)
    try {
      await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  public async findAllUsers() {
    let users: User[] | null = null;
    try {
      users = await this.userRepository.find();
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Database query failed. Please try again.',
      );
    }
    if (!users) {
      throw new RequestTimeoutException('No users found.');
    }
    return users;
  }
  private async verifyOtp(userId: number, otp: string) {
    const isVerified = await this.otpProvider.verifyOtp(userId, otp);
    if (!isVerified) {
      throw new RequestTimeoutException('OTP verification failed');
    }
    return isVerified;
  }

  public async updatePassword(
    userId: number,
    newPassword: string,
    otp: string,
  ) {
    // if verfied the otp will deleted automatically
    const isVerified = await this.verifyOtp(userId, otp);
    if (!isVerified) {
      throw new RequestTimeoutException('OTP verification failed');
    }
    const User = await this.findOneById(userId);
    if (!User) {
      throw new RequestTimeoutException('User not found');
    }
    const hashedPassword = await this.hashingProvider.hashPassword(newPassword);
    User.password = hashedPassword;
    await this.userRepository.save(User);
    return User;
  }

}
