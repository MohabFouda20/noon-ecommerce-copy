import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { createProductDto } from './dtos/create-product.dto';
import { PatchProductDto } from './dtos/patch-product.dto';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productService: ProductsService
    ){}
@Get()
public findAll(){
    return this.productService.findAll()
}
@Post()
public createProduct(@Body() createProductDto:createProductDto){
    return this.productService.createProduct(createProductDto)
}

@Get()
public findOneById(@Param('id') id : number){
    return this.productService.findProductById(id)
}
@Delete('delete')
public deleteProduct(@Param('id') id:number){
    return this.productService.deleteProduct(id)
}

@Patch('update')
public patchProduct(@Param('id') id:number , @Body() patchProductDto:PatchProductDto){
    return this.productService.updateProduct(id, patchProductDto)
}




}
