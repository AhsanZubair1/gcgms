import { Module } from '@nestjs/common';

import { EncryptionsService } from './encryptions.service';

@Module({
  imports: [],
  controllers: [],
  providers: [EncryptionsService],
  exports: [EncryptionsService],
})
export class EncryptionsModule {}
