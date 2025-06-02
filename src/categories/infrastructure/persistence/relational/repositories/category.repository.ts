import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '@src/categories/domain/category';
import { CategoryAbstractRepository } from '@src/categories/infrastructure/persistence/category.abstract.repository';
import { CategoryEntity } from '@src/categories/infrastructure/persistence/relational/entities/category.entity';
import { CategoryMapper } from '@src/categories/infrastructure/persistence/relational/mappers/category.mapper';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';

@Injectable()
export class CategoryRelationalRepository
  implements CategoryAbstractRepository
{
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAllWithPagination(): Promise<Category[]> {
    const entities = await this.categoryRepository.find({
      where: {
        is_active: true, // Only fetch active categories
      },
      order: {
        sort_order: 'ASC',
      },
    });

    return entities.map((entity) => CategoryMapper.toDomain(entity));
  }

  async findById(id: Category['id']): Promise<NullableType<Category>> {
    const entity = await this.categoryRepository.findOne({
      where: { id },
    });

    return entity ? CategoryMapper.toDomain(entity) : null;
  }
}
