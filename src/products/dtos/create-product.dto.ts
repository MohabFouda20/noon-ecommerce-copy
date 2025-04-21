import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createProductDto {
  
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(500)
  description: string;
  @IsInt()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(5)
  price: number;
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(5)
  stock: number;
  @IsNotEmpty()
  categoryId: number;
}
