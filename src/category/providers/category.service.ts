import { Injectable, RequestTimeoutException } from '@nestjs/common';
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
    const isExist = await this.categoryRepository.findBy({
      name: createCategoryDto.name,
    });
    if (!isExist) {
      throw new RequestTimeoutException('category is found');
    }
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      throw new RequestTimeoutException('can not create category');
    }
  }
  public async findOneById(categoryId: number) {
    const category = await this.categoryRepository.findOneBy({
      id: categoryId,
    });
    return category;
  }
  public async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }
  public async update(patchCategoryDto: PatchCategoryDto) {
    const category = await this.findOneById(patchCategoryDto.id);
    if (!category) {
      throw new RequestTimeoutException('no category with that id');
    }
    category.name = patchCategoryDto.name ?? category.name;
    category.description = patchCategoryDto.description ?? category.description;
    try {
      await this.categoryRepository.save(category);
      return 'updated succesfully';
    } catch (error) {
      throw new RequestTimeoutException('can not update category');
    }
  }
  public async delete(catergoryId) {
    const category = await this.findOneById(catergoryId);
    if (!category) {
      throw new RequestTimeoutException('no category with that id');
    }
    try {
      await this.categoryRepository.delete(category);
      return 'delete succesfully';
    } catch (error) {
      throw new RequestTimeoutException('can not delete the category');
    }
  }
}
