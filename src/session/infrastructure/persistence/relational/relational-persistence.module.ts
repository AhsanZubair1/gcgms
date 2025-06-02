import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GcCmsSessionEntity } from '@src/session/infrastructure/persistence/relational/entities/session.entity';
import { SessionAbstractRepository } from '@src/session/infrastructure/persistence/session.abstract.repository';

import { SessionRelationalRepository } from './repositories/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GcCmsSessionEntity])],
  providers: [
    {
      provide: SessionAbstractRepository,
      useClass: SessionRelationalRepository,
    },
  ],
  exports: [SessionAbstractRepository],
})
export class RelationalSessionPersistenceModule {}
