import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn } from 'class-validator';

import { MessageStatusEnum } from '@src/government-connect-messages/enum/message-status.enum';

export class UpdateMessageStatusDto {
  @ApiProperty()
  @IsIn([
    MessageStatusEnum.APPROVED,
    MessageStatusEnum.REJECTED,
    MessageStatusEnum.SUBMITTED_FOR_APPROVAL,
  ])
  @IsEnum(MessageStatusEnum)
  status: MessageStatusEnum;
}
