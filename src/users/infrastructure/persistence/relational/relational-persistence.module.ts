import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAbstractRepository } from '@src/users/infrastructure/persistence/user.abstract.repository';

import { GcCmsUserEntity } from './entities/gc-cms.user.entity';
import { UserStatusReasonsEntity } from './entities/user-status-reasons.entity';
import { UserEntity } from './entities/user.entity';
import { UsersRelationalRepository } from './repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserStatusReasonsEntity,
      GcCmsUserEntity,
    ]),
  ],
  providers: [
    {
      provide: UserAbstractRepository,
      useClass: UsersRelationalRepository,
    },
  ],
  exports: [UserAbstractRepository],
})
export class RelationalUserPersistenceModule {}
