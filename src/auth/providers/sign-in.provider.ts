import { Inject, Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../dtos/sign-in.dto';
import { User } from 'src/users/user.entity';
import { TokenService } from './tokens.service';

@Injectable()
export class SignInProvider {

    constructor(
        @Inject(UsersService)
            private readonly usersService: UsersService,
            private readonly hahshingService: HashingProvider,
            private readonly tokenService: TokenService,
        ){}
    
        public async signIn(signInDto:SignInDto){
            const user : User| null = await this.usersService.findOneByEmail(signInDto.email)
            if(!user){
                throw new RequestTimeoutException("User not found")
            }
            const isPasswordMatch :boolean = await this.hahshingService.comparePassword(signInDto.password, user.password)
            if(!isPasswordMatch){
                throw new UnauthorizedException("password not match")
            }
            // if(!user.isVerified){
            //     throw new UnauthorizedException("User is not active")
            // }
            const payload = {email: user.email, sub: user.id , role:user.role}
            const {accessToken , refreshToken } = await this.tokenService.generateTokens(user , payload)
            
            return {accessToken ,refreshToken , user:{email:user.email , role: user.role}}
    
        }
    
}
