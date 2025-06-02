import { Module, Global } from '@nestjs/common';

import { LoggingsService } from './loggings.service';

@Global()
@Module({
  providers: [LoggingsService],
  exports: [LoggingsService],
})
export class LoggingsModule {}
