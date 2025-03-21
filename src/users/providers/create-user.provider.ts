import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;
    try {
      existingUser = await this.userRepository.findOneBy({
        email: createUserDto.email,
      });
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'Database query failed. Please try again.',
      );
    }

    if (existingUser) {
      throw new RequestTimeoutException('Email already exists. Please log in.');
    }
    const hashedPassword = await this.hashingService.hashPassword(
      createUserDto.password,
    );

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);
    return newUser;
  }
}
