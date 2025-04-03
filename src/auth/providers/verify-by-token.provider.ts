import { Injectable } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class VerifyByTokenProvider {
    constructor(
        private readonly tokenService: TokenService,
        private readonly userService: UsersService,
    ) {}
    public async verifyEmailByToken(token: string) {
        const userId: number = await this.tokenService.verifyEmailToken(token);
        const user = await this.userService.findOneById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.isVerified = true;
        user.OTP = null; // delete the OTP after successful verification
        await this.userService.updateUser(user);
    }
}
