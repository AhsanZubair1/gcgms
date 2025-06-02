import { Module } from '@nestjs/common';

import { RelationalRolesPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [RelationalRolesPersistenceModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService, RelationalRolesPersistenceModule],
})
export class RolesModule {}
