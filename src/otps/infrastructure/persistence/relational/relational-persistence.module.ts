import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OtpAbstractRepository } from '@src/otps/infrastructure/persistence/otp.abstract.repository';
import { GcCmsOtpEntity } from '@src/otps/infrastructure/persistence/relational/entities/otp.entity';

import { OtpRelationalRepository } from './repositories/otp.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GcCmsOtpEntity])],
  providers: [
    {
      provide: OtpAbstractRepository,
      useClass: OtpRelationalRepository,
    },
  ],
  exports: [OtpAbstractRepository],
})
export class RelationalOtpPersistenceModule {}
