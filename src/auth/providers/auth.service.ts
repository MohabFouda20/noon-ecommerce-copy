import { Injectable } from '@nestjs/common';
import { SignInProvider } from './sign-in.provider';
import { TokenService } from './tokens.service';
import { SignInDto } from '../dtos/sign-in.dto';
import { LogOutProvider } from './log-out.provider';
import { SignUpDto } from '../dtos/sign-up.dto';
import { SignUpProvider } from './sign-up.provider';

@Injectable()
export class AuthService {
    constructor(
        private readonly signInProvider: SignInProvider,
        private readonly tokenService: TokenService,
        private readonly logoutProvider: LogOutProvider,
        private readonly signUpProvider:SignUpProvider,
    ){}
    public async signIn(signInDto:SignInDto){
        return await this.signInProvider.signIn(signInDto)
    }
    public async RefreshAccessToken(refreshTokenDto:string){
        return await this.tokenService.refreshAccessToken(refreshTokenDto)
    }
    public async logOut(refreshToken:string | null){
        return await this.logoutProvider.logOut(refreshToken)
    }
    public async SignUp(signUpDto:SignUpDto){
        return await this.signUpProvider.signUp(signUpDto)
    }
}
