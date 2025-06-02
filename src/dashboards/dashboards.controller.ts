import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ApprovedUserCountResponseDto } from '@src/dashboards/dto/approved-user-count.dto';
import { ArticleDto } from '@src/dashboards/dto/article.dto';
import { ContentCountResponseDto } from '@src/dashboards/dto/content-count.dto';
import { ContentRangeDto } from '@src/dashboards/dto/content-date-range.dto';
import { GetDateRangeDto } from '@src/dashboards/dto/date-range.dto';
import { VerificationStatusPercentageDto } from '@src/dashboards/dto/verification-status-percentage.dto';

import { DashboardsService } from './dashboards.service';

@ApiTags('Dashboards')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'dashboards',
  version: '1',
})
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) {}

  @Get('latest-articles')
  getLatestArticles(): Promise<ArticleDto[]> {
    return this.dashboardsService.getLatestArticles();
  }

  @Get('get-users-percentage')
  getUsersPercentage(): Promise<VerificationStatusPercentageDto[]> {
    return this.dashboardsService.getUsersPercentage();
  }

  @Get('get-approved-users-count')
  getApprovedUsersCount(
    @Query() dto: GetDateRangeDto,
  ): Promise<ApprovedUserCountResponseDto[]> {
    return this.dashboardsService.getApprovedUsersCount(dto);
  }

  @Get('content-counts')
  getContentCounts(
    @Query() dto: ContentRangeDto,
  ): Promise<ContentCountResponseDto[]> {
    return this.dashboardsService.findContentCounts(dto);
  }
}
