import { Injectable } from '@nestjs/common';

import { FileDto } from '@src/files/dto/file.dto';
import { UpdateFileDto } from '@src/files/dto/update.file.dto';
import { NullableType } from '@src/utils/types/nullable.type';

import { FileType } from './domain/file';
import { FileAbstractRepository } from './infrastructure/persistence/file.abstract.repository';

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileAbstractRepository) {}

  findById(id: FileType['id']): Promise<NullableType<FileType>> {
    return this.fileRepository.findById(id);
  }
  create(dto: FileDto): Promise<NullableType<FileType>> {
    return this.fileRepository.create(dto);
  }

  update(id: string, dto: UpdateFileDto): Promise<NullableType<FileType>> {
    return this.fileRepository.update(id, dto);
  }
}
