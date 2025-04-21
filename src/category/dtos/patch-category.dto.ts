import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryDto } from "./create-category.dto";
import { IsInt, IsNotEmpty } from "class-validator";

export class PatchCategoryDto extends PartialType(CreateCategoryDto){
    @IsNotEmpty()
    @IsInt()
    id:number
}