import { Injectable } from '@nestjs/common';

import { NOT_FOUND, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';

import { ArmedForceBranch } from './domain/armed-force-branch';
import { ArmedForceBranchAbstractRepository } from './infrastructure/persistence/armed-force-branch.abstract.repository';

@Injectable()
export class ArmedForceBranchesService {
  constructor(
    private readonly armedForceBranchRepository: ArmedForceBranchAbstractRepository,
  ) {}

  findAllWithPagination(): Promise<ArmedForceBranch[]> {
    return this.armedForceBranchRepository.findAllWithPagination();
  }

  findOne(id: ArmedForceBranch['id']) {
    return this.findAndValidate('id', id);
  }

  async findAndValidate(field, value, fetchRelations = false) {
    const repoFunction = `findBy${field.charAt(0).toUpperCase()}${field.slice(1)}${fetchRelations ? 'WithRelations' : ''}`; // capitalize first letter of the field name
    if (typeof this.armedForceBranchRepository[repoFunction] !== 'function') {
      throw UNPROCESSABLE_ENTITY(
        `Method ${repoFunction} not found on armedForceBranch repository.`,
        field,
      );
    }

    const armedForceBranch =
      await this.armedForceBranchRepository[repoFunction](value);
    if (!armedForceBranch) {
      throw NOT_FOUND('ArmedForceBranch', { [field]: value });
    }
    return armedForceBranch;
  }
}
