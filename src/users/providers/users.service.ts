import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly createUserProvider: CreateUserProvider,
    private readonly hashingProvider: HashingProvider,
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
    if (!user) {
      throw new RequestTimeoutException('User not found. Please register.');
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
   /**
    * create new user by using create signup provider from auth module 
    * here we only will create user and not send email
    * send email in sign up provider
    */

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
}