import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { ApiKeyGuard } from '@src/utils/guards/api-key.guard';

import { ArmedForceBranchesService } from './armed-force-branches.service';
import { ArmedForceBranch } from './domain/armed-force-branch';

@ApiTags('Armedforcebranches')
@ApiBearerAuth()
@UseGuards(ApiKeyGuard)
@Controller({
  path: 'armed-force-branches',
  version: '1',
})
export class ArmedForceBranchesController {
  constructor(
    private readonly armedForceBranchesService: ArmedForceBranchesService,
  ) {}

  @Get()
  findAll(): Promise<ArmedForceBranch[]> {
    return this.armedForceBranchesService.findAllWithPagination();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string) {
    return this.armedForceBranchesService.findOne(id);
  }
}
