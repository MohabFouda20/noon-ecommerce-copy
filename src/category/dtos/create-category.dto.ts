import { IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto{
    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    description?:string
}