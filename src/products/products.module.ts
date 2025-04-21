import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './providers/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from './product.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Products])],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
