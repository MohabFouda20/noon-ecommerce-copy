import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { UsersService } from 'src/users/providers/users.service';
import { User } from 'src/users/user.entity';
import { HashingProvider } from './hashing.provider';

@Injectable()
export class SignInService {
    constructor(
        private readonly usersService: UsersService,
        private readonly hahshingService: HashingProvider,
    ){}

    public async signIn(signInDto:SignInDto){
        const user : User| null = await this.usersService.findOneByEmail(signInDto.email)
        if(!user){
            throw new RequestTimeoutException("User not found")
        }
        const isPasswordMatch :boolean = await this.hahshingService.comparePassword(signInDto.password, user.password)
        if(!isPasswordMatch){
            throw new RequestTimeoutException("Invalid password")
        }
        return console.log("User signed in successfully")   
    }


}
