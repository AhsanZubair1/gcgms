import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArmedForceBranchAbstractRepository } from '@src/armed-force-branches/infrastructure/persistence/armed-force-branch.abstract.repository';

import { ArmedForceBranchEntity } from './entities/armed-force-branch.entity';
import { ArmedForceBranchRelationalRepository } from './repositories/armed-force-branch.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ArmedForceBranchEntity])],
  providers: [
    {
      provide: ArmedForceBranchAbstractRepository,
      useClass: ArmedForceBranchRelationalRepository,
    },
  ],
  exports: [ArmedForceBranchAbstractRepository],
})
export class RelationalArmedForceBranchPersistenceModule {}
