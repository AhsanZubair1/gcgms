import { Module } from '@nestjs/common';

import { MailModule } from '@src/mail/mail.module';

import { RelationalOtpPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { OtpsController } from './otps.controller';
import { OtpsService } from './otps.service';

@Module({
  imports: [RelationalOtpPersistenceModule, MailModule],
  controllers: [OtpsController],
  providers: [OtpsService],
  exports: [OtpsService, RelationalOtpPersistenceModule],
})
export class OtpsModule {}
