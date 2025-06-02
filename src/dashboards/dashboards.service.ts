import { Injectable } from '@nestjs/common';

import { ApprovedUserCountResponseDto } from '@src/dashboards/dto/approved-user-count.dto';
import { ArticleDto } from '@src/dashboards/dto/article.dto';
import { ContentCountResponseDto } from '@src/dashboards/dto/content-count.dto';
import { ContentRangeDto } from '@src/dashboards/dto/content-date-range.dto';
import { GetDateRangeDto } from '@src/dashboards/dto/date-range.dto';
import { VerificationStatusPercentageDto } from '@src/dashboards/dto/verification-status-percentage.dto';
import { FilesS3Service } from '@src/files/infrastructure/uploader/s3/files.service';
import { GovernmentConnectMessagesService } from '@src/government-connect-messages/government-connect-messages.service';
import { UsersService } from '@src/users/users.service';

@Injectable()
export class DashboardsService {
  constructor(
    private readonly governmentConnectMessagesService: GovernmentConnectMessagesService,
    private readonly usersService: UsersService,
    private readonly fileService: FilesS3Service,
  ) {}

  async getLatestArticles(): Promise<ArticleDto[]> {
    const articles =
      await this.governmentConnectMessagesService.getLatestArticles();

    return Promise.all(
      articles.map(async (article) => ({
        title: article.title,
        summary: article.summary,
        image: article.bannerImage
          ? await this.fileService.getFileUrl(article.bannerImage)
          : '',
      })),
    );
  }

  getUsersPercentage(): Promise<VerificationStatusPercentageDto[]> {
    return this.usersService.getVerificationStatusPercentage();
  }

  getApprovedUsersCount(
    dto: GetDateRangeDto,
  ): Promise<ApprovedUserCountResponseDto[]> {
    const range = dto.range || 'week';
    return this.usersService.findApprovedUserCounts(range);
  }

  findContentCounts(dto: ContentRangeDto): Promise<ContentCountResponseDto[]> {
    const range = dto.range || 'week';
    return this.governmentConnectMessagesService.findContentCounts(range);
  }
}
