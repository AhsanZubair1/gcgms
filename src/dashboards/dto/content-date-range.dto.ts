import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';

export class ContentRangeDto {
  @ApiPropertyOptional({
    description: 'The range for data (week, month, or today)',
    enum: ['week', 'month', 'today'],
    example: 'week',
  })
  @IsOptional()
  @IsIn(['week', 'month', 'today'], {
    message: 'range must be one of: week, month, year',
  })
  range?: 'week' | 'month' | 'today';
}
