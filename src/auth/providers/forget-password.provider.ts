import { Injectable, RequestTimeoutException, UnauthorizedException } from '@nestjs/common';
import { TokenService } from './tokens.service';
import { UsersService } from 'src/users/providers/users.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ForgetPasswordProvider {
    constructor(
        private readonly tokenService: TokenService,
        private readonly usersService:UsersService,
        private readonly mailService: MailService,
    ){}
    public async forgetPassword(email:string){
        const token =await this.tokenService.generateResetPasswordToken(email) 
        try{
            this.mailService.sendResetPasswordEmail(email,token)
        }catch(error){
            console.log(error)
            throw new RequestTimeoutException('cannot send the email')
        }
    }
    public async resetPassword(token:string , newPassword:string){
        try{
          const user = await this.usersService.findOneById(await this.tokenService.getUserIdByToken(token))
          this.usersService.resetPasswordUsingToken(user.id , newPassword)
          return "password changed successfully"
        }catch(error){
          console.log(error)
          throw new UnauthorizedException("wrong token data")
        }
      }

}
