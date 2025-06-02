import { SelectQueryBuilder } from 'typeorm';

import { UserCategory } from '@src/categories/enum/user-category.enum';
import { ApprovedUserCountResponseDto } from '@src/dashboards/dto/approved-user-count.dto';
import { VerificationStatusPercentageDto } from '@src/dashboards/dto/verification-status-percentage.dto';
import { GcCmsUser } from '@src/users/domain/gc-cms-user';
import { User } from '@src/users/domain/user';
import { ReasonResponseDto } from '@src/users/dto/reason-response.dto';
import { UpdateUserStatusDto } from '@src/users/dto/update-user-status.dto';
import {
  customDateRangetype,
  DateRangeOption,
} from '@src/users/dto/user-filter.dto';
import { UserWithFamilyInfo } from '@src/users/dto/user-with-family.dto';
import { UserResponseDto } from '@src/users/dto/users-res.dto';
import { PaginationResponseDto } from '@src/utils/dto/pagination-response.dto';
import { UserVerificationStatus } from '@src/utils/enums/user-verification.enum';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { UserSummary } from '@src/views/domain/user-summary';
import { UserSummaryViewEntity } from '@src/views/infrastructure/persistence/relational/entities/user-summary-view.entity';

export abstract class UserAbstractRepository {
  abstract findManyWithPagination({
    filterOptions,
  }: {
    filterOptions?: {
      verificationStatus?: UserVerificationStatus;
      dateRange?: DateRangeOption | customDateRangetype;
      userCategory?: UserCategory;
      paginationOptions: IPaginationOptions;
      sortOrder: 'ASC' | 'DESC';
      limit: number;
      page: number;
      search?: string;
    } | null;
  }): Promise<PaginationResponseDto<UserResponseDto>>;

  abstract findApprovedManyWithPagination({
    filterOptions,
  }: {
    filterOptions?: {
      dateRange?: DateRangeOption | customDateRangetype;
      userCategory?: UserCategory;
      paginationOptions: IPaginationOptions;
      sortOrder: 'ASC' | 'DESC';
      limit: number;
      page: number;
      search?: string;
    } | null;
  }): Promise<PaginationResponseDto<UserResponseDto>>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;
  abstract findGcCmsUserById(
    id: GcCmsUser['id'],
  ): Promise<NullableType<GcCmsUser>>;

  abstract hardDelete(id: User['id']): Promise<void>;

  abstract findByIdWithRelations(id: User['id']): Promise<NullableType<User>>;

  abstract getUserAndFamilyByPhone(referralCode: string);

  abstract findByEmail(
    email: GcCmsUser['email'],
  ): Promise<NullableType<GcCmsUser>>;

  abstract findByMilitaryId(militaryId: string): Promise<NullableType<User>>;

  abstract getReasonsByCategory(categoryId: string): Promise<{
    resubmitReasons: ReasonResponseDto[];
    rejectReasons: ReasonResponseDto[];
  }>;

  abstract updateUserStatus(
    updateUserStatusDto: UpdateUserStatusDto,
    cmsUserId: string,
  );
  abstract findByMykadId(mykadId: string): Promise<NullableType<User>>;
  abstract findApprovedByMykadId(
    mykadId: string,
  ): Promise<NullableType<UserWithFamilyInfo>>;
  abstract findByPhoneNumber(phoneNumber: string): Promise<NullableType<User>>;

  abstract update(
    id: GcCmsUser['id'],
    payload: DeepPartial<GcCmsUser>,
  ): Promise<GcCmsUser>;

  abstract softDelete(id: User['id']): Promise<void>;

  abstract restore(id: User['id']): Promise<void>;

  abstract permanentlyDelete(id: User['id']): Promise<void>;

  abstract findByProviderAndIdentifier(
    provider: UserCategory,
    identifierValue: string,
  ): Promise<NullableType<User>>;

  abstract getUserSummary(
    id: User['id'],
    query: SelectQueryBuilder<UserSummaryViewEntity>,
  ): Promise<NullableType<UserSummary>>;

  abstract count(filterOptions?: {
    verificationStatus?: string;
    baseCamp?: string;
    armedForceBranch?: string;
    userCategory?: string;
    biometricLogin?: boolean;
  }): Promise<number>;
  abstract getVerificationStatusPercentage(): Promise<VerificationStatusPercentageDto>;

  abstract findApprovedUserCounts(
    range: 'week' | 'month' | 'year',
  ): Promise<ApprovedUserCountResponseDto[]>;
}
