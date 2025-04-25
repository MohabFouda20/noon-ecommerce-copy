import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './providers/products.service';
import { createProductDto } from './dtos/create-product.dto';
import { PatchProductDto } from './dtos/patch-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productService: ProductsService, 
        private readonly fileUploadService: FileUploadService
    ){}
@Get()
public findAll(){
    return this.productService.findAll()
}

@Post()
@UseInterceptors(FilesInterceptor('images', 10))
public createProduct(@Body() createProductDto:createProductDto , @UploadedFiles() files:Express.Multer.File[]){
    if(!files){
        return 'No file uploaded'
    }
    console.log(files)
    return this.productService.createProduct(createProductDto, files)
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

@Post('file')
@UseInterceptors(FileInterceptor('image'))
public uploadFile(@UploadedFile() file:Express.Multer.File){
    console.log(file);
    return this.fileUploadService.uploadImage(file)
}

}
