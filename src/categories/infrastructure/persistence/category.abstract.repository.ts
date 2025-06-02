import { Category } from '@src/categories/domain/category';
import { NullableType } from '@src/utils/types/nullable.type';

export abstract class CategoryAbstractRepository {
  abstract findAllWithPagination(): Promise<Category[]>;

  abstract findById(id: Category['id']): Promise<NullableType<Category>>;
}
