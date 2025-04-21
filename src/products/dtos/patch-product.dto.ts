import { PartialType } from "@nestjs/mapped-types";
import { createProductDto } from "./create-product.dto";
import { IsInt } from "class-validator";

export class PatchProductDto extends PartialType(createProductDto){
    @IsInt()
    id:number
}