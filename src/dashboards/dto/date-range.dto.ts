import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';

export class GetDateRangeDto {
  @ApiPropertyOptional({
    description: 'The range for data (week, month, or year)',
    enum: ['week', 'month', 'year'],
    example: 'week',
  })
  @IsOptional()
  @IsIn(['week', 'month', 'year'], {
    message: 'range must be one of: week, month, year',
  })
  range?: 'week' | 'month' | 'year';
}
