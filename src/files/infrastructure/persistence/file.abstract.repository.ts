import { FileType } from '@src/files/domain/file';
import { UpdateFileDto } from '@src/files/dto/update.file.dto';
import { NullableType } from '@src/utils/types/nullable.type';

export abstract class FileAbstractRepository {
  abstract create(data: Omit<FileType, 'id'>): Promise<FileType>;

  abstract findById(id: FileType['id']): Promise<NullableType<FileType>>;

  abstract update(
    id: string,
    data: UpdateFileDto,
  ): Promise<NullableType<FileType>>;
}
