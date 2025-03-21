/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(96)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(96)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(96)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(96)
    @IsStrongPassword()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(15)
    phone: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsBoolean()
    @IsNotEmpty()
    isVerified: boolean;

    @IsDate()
    @IsNotEmpty()
    createdAt: Date;
}
