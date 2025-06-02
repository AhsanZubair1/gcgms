// user-filter.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  ValidateNested,
  IsIn,
  IsDate,
  IsNumber,
} from 'class-validator';

import { UserCategory } from '@src/categories/enum/user-category.enum';

export type DateRangeOption = 'today' | 'week' | 'month' | 'custom';
export interface customDateRangetype {
  from: Date;
  to: Date;
}

class CustomDateRangeDto {
  @IsDate()
  @Type(() => Date)
  from: Date;

  @IsDate()
  @Type(() => Date)
  to: Date;
}

export class ApprovedUserFilterDto {
  @ApiPropertyOptional({
    description: UserCategory.MILITARY,
    required: false,
  })
  @IsOptional()
  @IsString()
  userCategory?: UserCategory;

  @ApiPropertyOptional({
    description: 'today',
    required: false,
  })
  @IsOptional()
  @IsIn(['today', 'week', 'month'])
  dateRange?: 'today' | 'week' | 'month' | CustomDateRangeDto;

  @ApiPropertyOptional({
    description: 'date range',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomDateRangeDto)
  customDateRange?: CustomDateRangeDto;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    description: 'ASC',
    required: false,
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortOrder: 'ASC' | 'DESC';

  @ApiPropertyOptional({
    description: 'fullName',
    required: false,
  })
  @IsOptional()
  search?: string;
}
