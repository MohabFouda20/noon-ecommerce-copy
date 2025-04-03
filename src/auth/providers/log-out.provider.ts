import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { TokenService } from './tokens.service';

@Injectable()
export class LogOutProvider {
  constructor(private readonly tokenService: TokenService) {}

  public async logOut(refreshToken: string | null) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      await this.tokenService.revokeRefreshToken(refreshToken);
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      throw new InternalServerErrorException('Logout failed, please try again');
    }

    return { message: 'User logged out successfully' };
  }
}
