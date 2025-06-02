import { Module } from '@nestjs/common';

import { ArmedForceBranchesModule } from '@src/armed-force-branches/armed-force-branches.module';
import { CategoriesModule } from '@src/categories/categories.module';
import { FilesModule } from '@src/files/files.module';
import { FilesS3Module } from '@src/files/infrastructure/uploader/s3/files.module';
import { OtpsModule } from '@src/otps/otps.module';
import { SessionModule } from '@src/session/session.module';
import { ViewsModule } from '@src/views/views.module';

import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const infrastructurePersistenceModule = RelationalUserPersistenceModule;

@Module({
  imports: [
    infrastructurePersistenceModule,
    FilesModule,
    FilesS3Module,
    ViewsModule,
    OtpsModule,
    CategoriesModule,
    ArmedForceBranchesModule,
    SessionModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, infrastructurePersistenceModule, OtpsModule],
})
export class UsersModule {}
