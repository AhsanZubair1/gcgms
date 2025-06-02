import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

import { MessageStatusEnum } from '@src/government-connect-messages/enum/message-status.enum';

export enum DateFilter {
  TODAY = 'TODAY',
  WEEK = 'WEEK',
  CUSTOM = 'CUSTOM',
}

export class FindAllGovernmentConnectMessagesDto {
  @ApiPropertyOptional({
    type: Number,
    example: 1,
  })
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
  })
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    type: String,
    example: 'search term',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    enum: DateFilter,
    example: DateFilter.TODAY,
  })
  @IsEnum(DateFilter)
  @IsOptional()
  dateFilter?: DateFilter;

  @ApiPropertyOptional({
    type: String,
    example: '2023-01-01',
    description: 'Start date for custom date range (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({
    type: String,
    example: '2023-01-31',
    description: 'End date for custom date range (YYYY-MM-DD)',
  })
  @IsDateString()
  @IsOptional()
  toDate?: string;

  @ApiPropertyOptional({
    enum: MessageStatusEnum,
    example: MessageStatusEnum.PUBLISHED,
  })
  @IsEnum(MessageStatusEnum)
  @IsOptional()
  status?: MessageStatusEnum;
}
