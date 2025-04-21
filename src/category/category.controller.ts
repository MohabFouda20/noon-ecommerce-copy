import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './providers/category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { PatchCategoryDto } from './dtos/patch-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  public findOneById(@Param('id') id: number) {
    return this.categoryService.findOneById(id);
  }

  @Get()
  public findAll() {
    return this.categoryService.findAll();
  }
  @Post()
  public create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.Create(createCategoryDto);
  }
  @Put('update')
  public update(
    @Param('id') id: number,
    @Body() patchCategoryDto: PatchCategoryDto,
  ) {
    return this.categoryService.update(id, patchCategoryDto);
  }
  @Delete('delete')
  public delete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
