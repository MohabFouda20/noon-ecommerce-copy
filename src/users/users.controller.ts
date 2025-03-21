import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './providers/users.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ){}
    @Post('sign-up')
    public async signUp(@Body() createUserDto: CreateUserDto){
        return await this.usersService.signUp(createUserDto)
    }
    @Get('get-one-by-id')
    public async findOneById(@Param('id') id:number){
        return await this.usersService.findOneById(id)
    }
}
