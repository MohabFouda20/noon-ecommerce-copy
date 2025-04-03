import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { RequestTimeoutException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class OtpProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public generateOTP(length: number): string {
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
  }


  public async storeOTP(userId: number, otp: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new RequestTimeoutException('User not found in the database');
      }
      user.OTP = otp;
      await this.userRepository.save(user);
    } catch (error) {
      throw new RequestTimeoutException('cannot store the otp code');
    }
  }


  public async verifyOtp(userId: number, otp: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new RequestTimeoutException('User not found in the database');
      }
      if (user.OTP !== otp) {
        throw new UnauthorizedException('Invalid OTP code');
      }
      user.OTP = null; // delete the OTP after successful verification
      await this.userRepository.save(user);
      return true;
    } catch (error) {
      throw new RequestTimeoutException('cannot verify the otp code');
    }
  }
  public async verifyUserByOtp(userId:number, otp:string){
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new RequestTimeoutException('User not found in the database');
    }
    if (user.OTP !== otp) {
      throw new UnauthorizedException('Invalid OTP code');
    }
    user.isVerified = true;
    user.OTP = null; // delete the OTP after successful verification
    await this.userRepository.save(user);


}

}
