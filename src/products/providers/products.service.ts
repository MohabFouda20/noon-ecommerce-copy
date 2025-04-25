import {
  BadRequestException,
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from '../product.entity';
import { Repository } from 'typeorm';
import { createProductDto } from '../dtos/create-product.dto';
import { PatchProductDto } from '../dtos/patch-product.dto';
import { CategoryService } from 'src/category/providers/category.service';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productRepository: Repository<Products>,
    private readonly categoryService: CategoryService,
    private readonly fileUploadService : FileUploadService,
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




  public async createProduct(
    createProductDto: createProductDto,
    files: Express.Multer.File[],
  ) {
    const isExist = await this.productRepository.findOne({
      where: {
        name: createProductDto.name,
      },
    });
    if (isExist) throw new BadRequestException('product already exist');
    const isCategoryExists = await this.categoryService.findOneById(
      createProductDto.categoryId,
    );
    if (!isCategoryExists)
      throw new BadRequestException('category is not exists');

    const imageUrls = await this.fileUploadService.uploadMultiImages(files)
    const product = this.productRepository.create({
      ...createProductDto,
      images: imageUrls
    });

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



  public async deleteProduct(productId: number) {
    const product = await this.findProductById(productId);
    if (!product) {
      throw new RequestTimeoutException('product not found');
    }
    try {
      this.productRepository.delete(productId);
      return 'product deleted succefully';
    } catch (error) {
      throw new RequestTimeoutException('can not delete product');
    }
  }



  public async updateProduct(id: number, patchProductDto: PatchProductDto) {
    let product = await this.findProductById(id);
    if (!product) {
      throw new ConflictException('product not found');
    }
    product.name = patchProductDto.name ?? product.name;
    product.description = patchProductDto.description ?? product.description;
    product.price = patchProductDto.price ?? product.price;
    product.stock = patchProductDto.stock ?? product.stock;
    product.updatedAt = new Date();
    try {
      product = await this.productRepository.save(product);
    } catch (error) {
      throw new RequestTimeoutException('can not upadate product');
    }
  }
}
