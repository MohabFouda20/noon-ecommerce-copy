import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { Request, Response } from 'express';
import { SignUpDto } from './dtos/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private extractRefreshToken(req: Request): string | null {
    let refreshToken = req.cookies?.refreshToken || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!refreshToken) return null;

    // 🛠 Fix malformed token (if it contains 'refreshToken=')
    if (refreshToken.includes('refreshToken=')) {
      refreshToken = refreshToken.split('refreshToken=')[1];
    }

    // 🛠 Remove extra trailing data (if any)
    return refreshToken.split(';')[0]; 
  }

  @Post('sign-in')
  public async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    const { accessToken, refreshToken, user } =
      await this.authService.signIn(signInDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/auth/refresh-token',
    });
    return res.json({ accessToken, user });
  }


  @Post('refresh-token')
  public async refreshAccessToken(@Req() req: Request) {
    const refreshToken = this.extractRefreshToken(req)
  
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
    return await this.authService.RefreshAccessToken(refreshToken);
  }
  

  @Post('log-out')
  public async logOut(@Req() req: Request, @Res() res: Response) {
    const refreshToken = this.extractRefreshToken(req)

    await this.authService.logOut(refreshToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      path: '/auth/refresh-token',
    });

    return res.json({ message: 'Logged out successfully' });
  }

  @Post('sign-up')
  public async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.SignUp(signUpDto);
  }

  @Get('verify')
  public async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required');
    }
    try {
      return await this.authService.verifyEmailByToken(token);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  @Post('forget-password')
  public async forgetPassword(@Body('email')email:string){
    return this.authService.forgetPassword(email)
  }

  @Post('reset-password')
  public async resetPassword(@Query('token')token:string , @Body('password')password:string){
    return this.authService.resetPassword(token,password)
  }
}

