// Don't forget to use the class-validator decorators in the DTO properties.
// import { Allow } from 'class-validator';

import { PartialType } from '@nestjs/swagger';

import { CreateContentDto } from '@src/government-connect-messages/dto/create-article.dto';

export class UpdateGovernmentConnectMessageDto extends PartialType(
  CreateContentDto,
) {}
