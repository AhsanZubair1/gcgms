import { Module } from '@nestjs/common';

import { ArmedForceBranchesController } from './armed-force-branches.controller';
import { ArmedForceBranchesService } from './armed-force-branches.service';
import { RelationalArmedForceBranchPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalArmedForceBranchPersistenceModule],
  controllers: [ArmedForceBranchesController],
  providers: [ArmedForceBranchesService],
  exports: [
    ArmedForceBranchesService,
    RelationalArmedForceBranchPersistenceModule,
  ],
})
export class ArmedForceBranchesModule {}
