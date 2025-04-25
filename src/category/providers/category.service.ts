import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { PatchCategoryDto } from '../dtos/patch-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  public async Create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findBy({
      name: createCategoryDto.name,
    });
    if (existingCategory.length > 0) {
      throw new BadRequestException('Category already exists');
    }

    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      throw new BadRequestException('Failed to create category');
    }
  }
  public async findOneById(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    
    return category;
  }
  public async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }
  public async update(id: number, patchCategoryDto: PatchCategoryDto) {
    const category = await this.findOneById(id);
    
    // Check if new name already exists
    if (patchCategoryDto.name && patchCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findBy({
        name: patchCategoryDto.name,
      });
      if (existingCategory.length > 0) {
        throw new BadRequestException('Category name already exists');
      }
    }

    Object.assign(category, patchCategoryDto);

    try {
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      throw new BadRequestException('Failed to update category');
    }
  }
  public async delete(categoryId: number) {
    const category = await this.findOneById(categoryId);
    
    try {
      await this.categoryRepository.delete({ id: category.id });
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new BadRequestException('Failed to delete category');
    }
  }
}
