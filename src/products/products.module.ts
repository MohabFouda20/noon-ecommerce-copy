import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './product.entity';
import { CategoryModule } from 'src/category/category.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports:[TypeOrmModule.forFeature([Products]) , CategoryModule , FileUploadModule],
  controllers: [ProductsController],
  providers: [ProductsService ]
})
export class ProductsModule {}
