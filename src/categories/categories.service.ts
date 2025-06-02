import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { ErrorKey } from '@src/i18n/translation-keys';

import { Category } from './domain/category';
import { CategoryAbstractRepository } from './infrastructure/persistence/category.abstract.repository';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoryRepository: CategoryAbstractRepository,
  ) {}

  findAllWithPagination() {
    return this.categoryRepository.findAllWithPagination();
  }

  findOne(id: Category['id']) {
    return this.findAndValidate('id', id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.categoryRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        ErrorKey.METHOD_NOT_FOUND,
        field,
        undefined,
        'CategoryRepository',
        repoFunction,
      );
    }

    const category = await this.categoryRepository[repoFunction](value);
    if (!category) {
      throw NOT_FOUND('Category', { [field]: value });
    }
    return category;
  }
}
