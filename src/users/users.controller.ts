import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { AuthUserType } from '@src/auth/dto/auth-user.dto';
import { Permissions } from '@src/roles/roles.decorator';
import { RolesGuard } from '@src/roles/roles.guard';
import { GcCmsUser } from '@src/users/domain/gc-cms-user';
import { ApprovedUserFilterDto } from '@src/users/dto/approved-user.filter.dto';
import { GetReasonsDto } from '@src/users/dto/get-reasons.dto';
import { UpdateUserStatusDto } from '@src/users/dto/update-user-status.dto';
import { UpdateDto } from '@src/users/dto/update.dto';
import { UserFilterDto } from '@src/users/dto/user-filter.dto';
import { AuthUser } from '@src/utils/decorators/auth.decorator';
import { UserVerificationStatus } from '@src/utils/enums/user-verification.enum';
import { NullableType } from '@src/utils/types/nullable.type';

import { UsersService } from './users.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Patch('update')
  @ApiOperation({ summary: 'update' })
  @ApiBody({ type: UpdateDto })
  updateLimitedProfile(
    @Body() updateProfileDto: UpdateDto,
    @AuthUser() user: AuthUserType,
  ): Promise<{ data: string }> {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }
  @Post('profile')
  @Permissions('Approve Users')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'user profile ' })
  async profile(
    @AuthUser() user: AuthUserType,
  ): Promise<NullableType<GcCmsUser>> {
    return await this.usersService.profile(user.id);
  }
  @Get('approved/user')
  getApprovedUsers(@Query() filterDto: ApprovedUserFilterDto) {
    const dateRange = filterDto.customDateRange
      ? filterDto.customDateRange
      : filterDto.dateRange;

    return this.usersService.findApprovedManyWithPagination({
      filterOptions: {
        userCategory: filterDto.userCategory,
        dateRange,
        paginationOptions: { page: filterDto.page!, limit: filterDto.limit! },
        sortOrder: filterDto.sortOrder,
        limit: filterDto.limit ?? 10,
        page: filterDto.page ?? 1,
        search: filterDto.search,
      },
    });
  }

  @Get()
  async getUsers(@Query() filterDto: UserFilterDto) {
    // Combine dateRange and customDateRange into a single filter
    const dateRange = filterDto.customDateRange
      ? filterDto.customDateRange
      : filterDto.dateRange;

    return await this.usersService.findManyWithPagination({
      filterOptions: {
        verificationStatus: filterDto.verificationStatus,
        userCategory: filterDto.userCategory,
        dateRange,
        paginationOptions: { page: filterDto.page!, limit: filterDto.limit! },
        sortOrder: filterDto.sortOrder,
        limit: filterDto.limit ?? 10,
        page: filterDto.page ?? 1,
        search: filterDto.search,
      },
    });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findByMykadId(id);
  }

  @Get('approved/:id')
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  findApprovedOne(@Param('id') id: string) {
    return this.usersService.findApprovedByMykadId(id);
  }

  @Post('get-by-category')
  @ApiOperation({ summary: 'Get resubmit and reject reasons by category ID' })
  getReasonsByCategory(@Body() getReasonsDto: GetReasonsDto) {
    return this.usersService.findAllreasonsAsync(getReasonsDto.categoryId);
  }

  @Put('status')
  @ApiOperation({ summary: 'Update user status with reasons' })
  updateStatus(
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @AuthUser() user: AuthUserType,
  ) {
    return this.usersService.updateStatusupdateUserStatus(
      updateUserStatusDto,
      user.id,
    );
  }

  @Get('verification/status')
  getUserVerificationStatus() {
    const data = [
      UserVerificationStatus.REJECTED,
      UserVerificationStatus.PENDING,
      UserVerificationStatus.RESUBMISSION_REQUIRED,
    ];
    return data;
  }
}
