import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesAbstractRepository } from '@src/roles/infrastructure/persistence/roles.abstract.repository';

import { RolesEntity } from './entities/roles.entity';
import { RolesRelationalRepository } from './repositories/roles.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RolesEntity])],
  providers: [
    {
      provide: RolesAbstractRepository,
      useClass: RolesRelationalRepository,
    },
  ],
  exports: [RolesAbstractRepository],
})
export class RelationalRolesPersistenceModule {}
