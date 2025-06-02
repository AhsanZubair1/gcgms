import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ArmedForceBranch } from '@src/armed-force-branches/domain/armed-force-branch';
import { ArmedForceBranchAbstractRepository } from '@src/armed-force-branches/infrastructure/persistence/armed-force-branch.abstract.repository';
import { ArmedForceBranchEntity } from '@src/armed-force-branches/infrastructure/persistence/relational/entities/armed-force-branch.entity';
import { ArmedForceBranchMapper } from '@src/armed-force-branches/infrastructure/persistence/relational/mappers/armed-force-branch.mapper';
import { NullableType } from '@src/utils/types/nullable.type';

@Injectable()
export class ArmedForceBranchRelationalRepository
  implements ArmedForceBranchAbstractRepository
{
  constructor(
    @InjectRepository(ArmedForceBranchEntity)
    private readonly armedForceBranchRepository: Repository<ArmedForceBranchEntity>,
  ) {}

  async findAllWithPagination(): Promise<ArmedForceBranch[]> {
    const entities = await this.armedForceBranchRepository.find({
      where: {
        is_active: true, // Only fetch active categories
      },
      order: {
        sort_order: 'ASC',
      },
    });

    return entities.map((entity) => ArmedForceBranchMapper.toDomain(entity));
  }

  async findById(
    id: ArmedForceBranch['id'],
  ): Promise<NullableType<ArmedForceBranch>> {
    const entity = await this.armedForceBranchRepository.findOne({
      where: { id },
    });

    return entity ? ArmedForceBranchMapper.toDomain(entity) : null;
  }
}
