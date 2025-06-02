import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@src/utils/dto/infinity-pagination-response.dto';
import { ApiKeyGuard } from '@src/utils/guards/api-key.guard';
import { infinityPagination } from '@src/utils/infinity-pagination';

import { CategoriesService } from './categories.service';
import { Category } from './domain/category';
import { FindAllCategoriesDto } from './dto/find-all-categories.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  // @UseGuards(ApiKeyGuard)
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAllWithPagination();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }
}
