import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from '../product.entity';
import { Repository } from 'typeorm';
import { createProductDto } from '../dtos/create-product.dto';
import { PatchProductDto } from '../dtos/patch-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
  ) {}
  public async findAll() {
    const products = await this.productRepository.find();
    return products;
  }
  public async findProductById(productId: number) {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
    return product;
  }
  public async createProduct(createProductDto: createProductDto) {
    const product = this.productRepository.create(createProductDto);
    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException(
        'can not save product in the database ',
      );
    }
  }
  public async deleteProduct(productId:number){
    const product = await this.findProductById(productId)
    if (!product) {
        throw new RequestTimeoutException('product not found')
    }
    try{
        this.productRepository.delete(productId)
        return "product deleted succefully"
    }catch(error){
        throw new RequestTimeoutException('can not delete product')
        
    }

  }
  public async updateProduct(id:number , patchProductDto:PatchProductDto){
    let product = await this.findProductById(id)
    if (!product) {
        throw new ConflictException('product not found')
    } 
    product.name = patchProductDto.name ?? product.name
    product.description = patchProductDto.description ?? product.description
    product.price = patchProductDto.price ?? product.price
    product.stock = patchProductDto.stock ?? product.stock
    product.updatedAt = new Date()
    try{
        product = await this.productRepository.save(product)
    }catch(error){
        throw new RequestTimeoutException('can not upadate product')
    }
  }

  
}
