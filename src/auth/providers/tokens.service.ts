import { Inject, Injectable, InternalServerErrorException, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { User } from 'src/users/user.entity';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashingService: HashingProvider,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfigration: ConfigType<typeof jwtConfig>,
  ) {}

  public async generateTokens(user: User , payload?: any) {
    const accessToken = await this.signToken(user.id, this.jwtConfigration.accessTokenTTL, payload);
    const refreshToken = await this.signToken(user.id, this.jwtConfigration.refreshTokenTTL , payload);

    await this.saveRefreshToken(user.id, refreshToken);
    
    return { accessToken, refreshToken };
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return this.jwtService.signAsync(
      { sub: userId, ...payload },
      {
        audience: this.jwtConfigration.audience,
        issuer: this.jwtConfigration.issuer,
        secret: expiresIn === this.jwtConfigration.refreshTokenTTL
          ? this.jwtConfigration.refreshSecret // Separate refresh token secret
          : this.jwtConfigration.secret,
        expiresIn,
      }
    );
  }

  private async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedToken = await this.hashingService.hashPassword(refreshToken);
    const user: User = await this.usersService.findOneById(userId);
    if (!user) {
      throw new RequestTimeoutException("there is no user with this id");
    }
    user.refreshToken = hashedToken;

    await this.usersService.updateUser(user);
  }

  public async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: number }>(refreshToken, {
        secret: this.jwtConfigration.refreshSecret,
      });

      const user = await this.usersService.findOneById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException();
      }

      const isTokenMatch = await this.hashingService.comparePassword(refreshToken, user.refreshToken);
      if (!isTokenMatch) {
        throw new UnauthorizedException();
      }

      return this.signToken(user.id, this.jwtConfigration.accessTokenTTL, { email: user.email });
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  public async revokeRefreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    let payload :any 
    try{
      payload = this.jwtService.verify(refreshToken, { secret: this.jwtConfigration.refreshSecret })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch(error){
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOneById(payload.sub);
    
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      user.refreshToken = null; 
      await this.usersService.updateUser(user);
      return { message: 'Refresh token removed successfully' };
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      throw new InternalServerErrorException('Failed to revoke refresh token');
    }
  }
}
  