import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  DataSource,
  FindOptionsWhere,
  ILike,
  In,
  Not,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

import { UserCategory } from '@src/categories/enum/user-category.enum';
import { FORBIDDEN, UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { ApprovedUserCountResponseDto } from '@src/dashboards/dto/approved-user-count.dto';
import { VerificationStatusPercentageDto } from '@src/dashboards/dto/verification-status-percentage.dto';
import { ErrorKey } from '@src/i18n/translation-keys';
import { GcCmsUser } from '@src/users/domain/gc-cms-user';
import { User } from '@src/users/domain/user';
import { ReasonResponseDto } from '@src/users/dto/reason-response.dto';
import { UpdateUserStatusDto } from '@src/users/dto/update-user-status.dto';
import {
  customDateRangetype,
  DateRangeOption,
} from '@src/users/dto/user-filter.dto';
import {
  NullableUserWithFamily,
  UserWithFamilyInfo,
} from '@src/users/dto/user-with-family.dto';
import { UserResponseDto } from '@src/users/dto/users-res.dto';
import { UserStatusReasonsEnum } from '@src/users/enum/user-status.enum';
import { GcCmsUserEntity } from '@src/users/infrastructure/persistence/relational/entities/gc-cms.user.entity';
import { UserStatusReasonsEntity } from '@src/users/infrastructure/persistence/relational/entities/user-status-reasons.entity';
import { UserEntity } from '@src/users/infrastructure/persistence/relational/entities/user.entity';
import { GcCmsUserMapper } from '@src/users/infrastructure/persistence/relational/mappers/gc-cms-user.mapper';
import { UserStatusReasonsMapper } from '@src/users/infrastructure/persistence/relational/mappers/user-status-reasons.mapper';
import { UserMapper } from '@src/users/infrastructure/persistence/relational/mappers/user.mapper';
import { UserAbstractRepository } from '@src/users/infrastructure/persistence/user.abstract.repository';
import { getDateRangeConfig } from '@src/utils/date-range-helper';
import { PaginationResponseDto } from '@src/utils/dto/pagination-response.dto';
import { UserVerificationStatus } from '@src/utils/enums/user-verification.enum';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { UserSummary } from '@src/views/domain/user-summary';
import { UserSummaryViewEntity } from '@src/views/infrastructure/persistence/relational/entities/user-summary-view.entity';
import { UserSummaryMapper } from '@src/views/infrastructure/persistence/relational/mappers/user.summary.mapper';

@Injectable()
export class UsersRelationalRepository implements UserAbstractRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(GcCmsUserEntity)
    private readonly gcCmsUsersRepository: Repository<GcCmsUserEntity>,

    @InjectRepository(UserStatusReasonsEntity)
    private readonly usersRejectionRepo: Repository<UserStatusReasonsEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async getUserAndFamilyByPhone(referralCode: string) {
    const entity = await this.usersRepository.findOne({
      where: { referral_code: referralCode },
      relations: ['family_members'],
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }
  async findManyWithPagination({
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
  }): Promise<PaginationResponseDto<UserResponseDto>> {
    let where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[] =
      {};

    // Handle search with OR conditions using array approach
    if (filterOptions?.search) {
      const search = filterOptions.search.toLowerCase();
      where = [
        { full_name: ILike(`%${search}%`) },
        { phone_number: ILike(`%${search}%`) },
        { mykad_id: ILike(`%${search}%`) },
      ];
    }

    // Verification status
    if (filterOptions?.verificationStatus) {
      if (Array.isArray(where)) {
        where = where.map((condition) => ({
          ...condition,
          verification_status: filterOptions.verificationStatus,
        }));
      } else {
        where.verification_status = filterOptions.verificationStatus;
      }
    } else {
      if (Array.isArray(where)) {
        where = where.map((condition) => ({
          ...condition,
          verification_status: Not(UserVerificationStatus.APPROVED),
        }));
      } else {
        where.verification_status = Not(UserVerificationStatus.APPROVED);
      }
    }

    // Date range filter
    if (filterOptions?.dateRange) {
      const now = new Date();
      let dateRangeCondition: { created_at: any } | undefined = undefined;
      if (filterOptions.dateRange === 'today') {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));
        dateRangeCondition = { created_at: Between(startOfDay, endOfDay) };
      } else if (filterOptions.dateRange === 'week') {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        dateRangeCondition = { created_at: Between(startOfWeek, endOfWeek) };
      } else if (filterOptions.dateRange === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        dateRangeCondition = { created_at: Between(startOfMonth, endOfMonth) };
      } else if (typeof filterOptions.dateRange === 'object') {
        dateRangeCondition = {
          created_at: Between(
            filterOptions.dateRange.from,
            filterOptions.dateRange.to,
          ),
        };
      }

      if (dateRangeCondition) {
        if (Array.isArray(where)) {
          where = where.map((condition) => ({
            ...condition,
            ...dateRangeCondition,
          }));
        } else {
          where = { ...where, ...dateRangeCondition };
        }
      }
    }

    // User category filter
    if (filterOptions?.userCategory) {
      const categoryCondition = {
        category: { id: filterOptions.userCategory },
      };
      if (Array.isArray(where)) {
        where = where.map((condition) => ({
          ...condition,
          ...categoryCondition,
        }));
      } else {
        where = { ...where, ...categoryCondition };
      }
    }

    // Pagination
    const pageNumber = filterOptions?.page ?? 1;
    const pageLimit = filterOptions?.limit ?? 10;
    const sortOrder = filterOptions?.sortOrder ?? 'DESC';

    // Get total count
    const totalRecords = await this.usersRepository.count({ where });

    // Get paginated results
    const entities = await this.usersRepository.find({
      where,
      skip: (pageNumber - 1) * pageLimit,
      take: pageLimit,
      relations: ['category'],
      order: {
        created_at: sortOrder,
      },
    });

    return {
      data: entities.map((user) => ({
        fullName: user.full_name,
        phoneNumber: user.phone_number,
        mykadId: user.mykad_id,
        category: user.category?.value,
        verificationStatus: user.verification_status,
        createdAt: user.created_at.toDateString(),
      })),
      hasNextPage: pageNumber * pageLimit < totalRecords,
      totalRecords,
      pageLimit,
      pageNumber,
      to: Math.min(pageNumber * pageLimit, totalRecords),
      from: (pageNumber - 1) * pageLimit + 1,
    };
  }

  async findApprovedManyWithPagination({
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
  }): Promise<PaginationResponseDto<UserResponseDto>> {
    let where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[] =
      {};

    // Handle search with OR conditions using array approach
    if (filterOptions?.search) {
      const search = filterOptions.search.toLowerCase();
      where = [
        { full_name: ILike(`%${search}%`) },
        { phone_number: ILike(`%${search}%`) },
        { mykad_id: ILike(`%${search}%`) },
      ];
    }

    if (Array.isArray(where)) {
      where = where.map((condition) => ({
        ...condition,
        verification_status: UserVerificationStatus.APPROVED,
      }));
    } else {
      where.verification_status = UserVerificationStatus.APPROVED;
    }

    // Date range filter
    if (filterOptions?.dateRange) {
      const now = new Date();
      let dateRangeCondition: { created_at: any } | undefined = undefined;
      if (filterOptions.dateRange === 'today') {
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));
        dateRangeCondition = { created_at: Between(startOfDay, endOfDay) };
      } else if (filterOptions.dateRange === 'week') {
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        dateRangeCondition = { created_at: Between(startOfWeek, endOfWeek) };
      } else if (filterOptions.dateRange === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        endOfMonth.setHours(23, 59, 59, 999);
        dateRangeCondition = { created_at: Between(startOfMonth, endOfMonth) };
      } else if (typeof filterOptions.dateRange === 'object') {
        dateRangeCondition = {
          created_at: Between(
            filterOptions.dateRange.from,
            filterOptions.dateRange.to,
          ),
        };
      }

      if (dateRangeCondition) {
        if (Array.isArray(where)) {
          where = where.map((condition) => ({
            ...condition,
            ...dateRangeCondition,
          }));
        } else {
          where = { ...where, ...dateRangeCondition };
        }
      }
    }

    // User category filter
    if (filterOptions?.userCategory) {
      const categoryCondition = {
        category: { id: filterOptions.userCategory },
      };
      if (Array.isArray(where)) {
        where = where.map((condition) => ({
          ...condition,
          ...categoryCondition,
        }));
      } else {
        where = { ...where, ...categoryCondition };
      }
    }

    // Pagination
    const pageNumber = filterOptions?.page ?? 1;
    const pageLimit = filterOptions?.limit ?? 10;
    const sortOrder = filterOptions?.sortOrder ?? 'DESC';

    // Get total count
    const totalRecords = await this.usersRepository.count({ where });

    // Get paginated results
    const entities = await this.usersRepository.find({
      where,
      skip: (pageNumber - 1) * pageLimit,
      take: pageLimit,
      relations: ['category'],
      order: {
        created_at: sortOrder,
      },
    });

    // Process family members for users with category "Families"
    const processedEntities = await Promise.all(
      entities.map(async (user) => {
        const response: any = {
          fullName: user.full_name,
          phoneNumber: user.phone_number,
          mykadId: user.mykad_id,
          category: user.category?.value,
          verificationStatus: user.verification_status,
          parentName: null,
          createdAt: user.created_at.toDateString(),
        };
        if (response.category === 'Families') {
          // Find family member by phone number
          const [familyMember] = await this.dataSource.query(
            `SELECT inviter_id FROM family_member 
             WHERE phone_number = $1 LIMIT 1`,
            [user.phone_number],
          );

          if (familyMember && familyMember.inviter_id) {
            // Find parent user by referral code (assuming inviter_id is the user's id)
            const parentUser = await this.usersRepository.findOne({
              where: { id: familyMember.inviter_id },
              select: ['full_name', 'referral_code'],
            });

            if (parentUser) {
              response.parentName = parentUser.full_name;
              response.referralCode = parentUser.referral_code;
            }
          }
        }

        return response;
      }),
    );

    return {
      data: processedEntities,
      hasNextPage: pageNumber * pageLimit < totalRecords,
      totalRecords,
      pageLimit,
      pageNumber,
      to: Math.min(pageNumber * pageLimit, totalRecords),
      from: (pageNumber - 1) * pageLimit + 1,
    };
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: { id },
      relations: ['armed_force_branch', 'photos', 'category'],
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async getReasonsByCategory(categoryId: string): Promise<{
    resubmitReasons: ReasonResponseDto[];
    rejectReasons: ReasonResponseDto[];
  }> {
    const [resubmitReasons, rejectReasons] = await Promise.all([
      this.usersRejectionRepo.find({
        where: {
          category: { id: categoryId },
          type: UserStatusReasonsEnum.RESUBMISSION,
          is_active: true,
        },
        order: {
          sort_order: 'ASC',
        },
      }),
      this.usersRejectionRepo.find({
        where: {
          category: { id: categoryId },
          type: UserStatusReasonsEnum.REJECT,
          is_active: true,
        },
        order: {
          sort_order: 'ASC',
        },
      }),
    ]);

    return {
      resubmitReasons: resubmitReasons.map((reason) =>
        UserStatusReasonsMapper.toDomain(reason),
      ),
      rejectReasons: rejectReasons.map((reason) =>
        UserStatusReasonsMapper.toDomain(reason),
      ),
    };
  }

  async updateUserStatus(
    updateUserStatusDto: UpdateUserStatusDto,
    cmsUserId: string,
  ) {
    const { status, reasonIds, mykadId } = updateUserStatusDto;

    const user = await this.usersRepository.findOne({
      where: { mykad_id: mykadId },
    });

    if (!user) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.NOT_PRESENT, 'mykadId');
    }

    let reasonsString = '';
    if (reasonIds && reasonIds.length > 0) {
      const reasons = await this.usersRejectionRepo.find({
        where: {
          id: In(reasonIds),
        },
      });

      if (reasons.length !== reasonIds.length) {
        throw UNPROCESSABLE_ENTITY(ErrorKey.NOT_PRESENT, 'reasons');
      }

      if (status === UserVerificationStatus.REJECTED) {
        const invalidReasons = reasons.filter((r) => r.type !== 'REJECT');
        if (invalidReasons.length > 0) {
          throw FORBIDDEN(
            'Cannot use non-REJECT reasons for REJECTED status',
            'id',
          );
        }
      } else if (status === UserVerificationStatus.RESUBMISSION_REQUIRED) {
        const invalidReasons = reasons.filter((r) => r.type !== 'RESUBMISSION');
        if (invalidReasons.length > 0) {
          throw FORBIDDEN(
            'Cannot use non-RESUBMISSION reasons for RESUBMISSION_REQUIRED status',
            'id',
          );
        }
      }

      reasonsString = reasonIds.join(',');
      user.reasons = reasonsString;
    } else if (
      status === UserVerificationStatus.REJECTED ||
      status === UserVerificationStatus.RESUBMISSION_REQUIRED
    ) {
      throw new Error(`Reason IDs are required for ${status} status`);
    }
    if (status === UserVerificationStatus.APPROVED) {
      user.reasons = null;
    }
    user.verification_status = status;
    user.updated_at = new Date();
    user.updated_by = cmsUserId;

    await this.usersRepository.save(user);

    return {
      success: true,
      message: 'User status updated successfully',
      data: {
        mykadId: user.mykad_id,
        status: user.verification_status,
        reasons: user.reasons,
      },
    };
  }

  async findGcCmsUserById(
    id: GcCmsUser['id'],
  ): Promise<NullableType<GcCmsUser>> {
    const entity = await this.gcCmsUsersRepository.findOne({
      where: { id },
      relations: ['profile_picture', 'gc_cms_category'],
    });

    return entity ? GcCmsUserMapper.toDomain(entity) : null;
  }

  async findByIdWithRelations(id: User['id']): Promise<NullableType<User>> {
    const entity = await this.usersRepository.findOne({
      where: { id },
      relations: ['armed_force_branch', 'photos'],
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async hardDelete(id: User['id']): Promise<void> {
    await this.usersRepository.delete(id); // Permanent delete
  }

  async findByEmail(
    email: GcCmsUser['email'],
  ): Promise<NullableType<GcCmsUser>> {
    if (!email) return null;

    const entity = await this.gcCmsUsersRepository.findOne({
      where: { email },
      relations: [
        'gc_cms_category',
        'profile_picture',
        'gc_cms_roles',
        'gc_cms_roles.role',
      ],
    });

    return entity ? GcCmsUserMapper.toDomain(entity) : null;
  }

  async findByMilitaryId(militaryId: string): Promise<NullableType<User>> {
    if (!militaryId) return null;

    const entity = await this.usersRepository.findOne({
      where: { military_id: militaryId },
      relations: ['armed_force_branch', 'photos'],
    });

    const user = entity ? UserMapper.toDomain(entity) : null;

    if (
      entity?.verification_status ===
        UserVerificationStatus.RESUBMISSION_REQUIRED &&
      entity.reasons
    ) {
      const reasonIds = entity.reasons
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id);

      const reasons = await this.usersRejectionRepo.findBy({
        id: In(reasonIds),
      });

      if (user) {
        user.reasons = reasons.map((reason) =>
          UserStatusReasonsMapper.toDomain(reason),
        );
      }
    }

    return user;
  }

  async findByMykadId(mykadId: string): Promise<NullableType<User>> {
    if (!mykadId) return null;

    const entity = await this.usersRepository.findOne({
      where: { mykad_id: mykadId },
      relations: ['category', 'photos'],
    });

    const user = entity ? UserMapper.toDomain(entity) : null;

    if (entity?.reasons) {
      const reasonIds = entity.reasons
        .split(',')
        .map((id) => id.trim())
        .filter((id) => id);

      const reasons = await this.usersRejectionRepo.findBy({
        id: In(reasonIds),
      });

      if (user) {
        user.reasons = reasons.map((reason) =>
          UserStatusReasonsMapper.toDomain(reason),
        );
      }
    }

    return user;
  }

  async findApprovedByMykadId(
    mykadId: string,
  ): Promise<NullableUserWithFamily> {
    if (!mykadId) return null;

    const entity = await this.usersRepository.findOne({
      where: { mykad_id: mykadId },
      relations: ['category', 'photos'],
    });

    if (!entity) return null;
    const baseUser = UserMapper.toDomain(entity);
    const user: UserWithFamilyInfo = {
      ...baseUser,
      email: baseUser.email ?? undefined,
    };

    if (entity.category?.value.en === 'Families') {
      const [familyMember] = await this.dataSource.query(
        `SELECT inviter_id FROM family_member 
         WHERE mykad_id = $1 LIMIT 1`,
        [mykadId],
      );

      if (familyMember?.inviter_id) {
        const [parentUser] = await this.dataSource.query(
          `SELECT full_name, referral_code FROM "user" 
           WHERE id = $1 LIMIT 1`,
          [familyMember.inviter_id],
        );

        if (parentUser) {
          user.parentName = parentUser.full_name;
          user.referralCode = parentUser.referral_code;
        }
      }
    }

    return user;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<NullableType<User>> {
    if (!phoneNumber) return null;

    const entity = await this.usersRepository.findOne({
      where: { phone_number: phoneNumber },
      relations: ['armed_force_branch', 'photos'],
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(id: GcCmsUser['id'], payload: GcCmsUser): Promise<GcCmsUser> {
    const updatedEntity = GcCmsUserMapper.toPersistence(payload);

    await this.gcCmsUsersRepository.update(id, updatedEntity);

    return payload;
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async restore(id: User['id']): Promise<void> {
    await this.usersRepository.restore(id);
  }

  async permanentlyDelete(id: User['id']): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findByProviderAndIdentifier(
    provider: UserCategory,
    identifierValue: string,
  ): Promise<User | null> {
    const where: FindOptionsWhere<UserEntity> = {};
    if (provider === UserCategory.MILITARY) {
      where.military_id = identifierValue;
    } else if (provider === UserCategory.MILITARY_FAMILY) {
      where.mykad_id = identifierValue;
    }

    const entity = await this.usersRepository.findOne({
      where,
      relations: ['armed_force_branch', 'photos'],
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async getUserSummary(
    id: User['id'],
    query: SelectQueryBuilder<UserSummaryViewEntity>,
  ): Promise<NullableType<UserSummary>> {
    const summary = await query.where({ id: Number(id) }).getOne();
    return summary ? UserSummaryMapper.toDomain(summary) : null;
  }

  async count(filterOptions?: {
    verificationStatus?: string;
    baseCamp?: string;
    armedForceBranch?: string;
    userCategory?: string;
  }): Promise<number> {
    const where: FindOptionsWhere<UserEntity> = {};

    if (filterOptions?.verificationStatus) {
      where.verification_status = filterOptions.verificationStatus;
    }

    if (filterOptions?.armedForceBranch) {
      where.armed_force_branch = { id: filterOptions.armedForceBranch };
    }

    return this.usersRepository.count({ where });
  }

  async getVerificationStatusPercentage(): Promise<VerificationStatusPercentageDto> {
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.verification_status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.verification_status')
      .getRawMany();

    const totalCount = result.reduce(
      (sum, { count }) => sum + Number(count),
      0,
    );

    if (totalCount === 0) {
      return {
        approvedPercentage: 0,
        resubmissionPercentage: 0,
        pendingPercentage: 0,
      };
    }

    const countByStatus = Object.fromEntries(
      result.map(({ status, count }) => [status, Number(count)]),
    );

    // Calculate raw percentages first
    const approved =
      ((countByStatus[UserVerificationStatus.APPROVED] || 0) / totalCount) *
      100;
    const resubmission =
      ((countByStatus[UserVerificationStatus.RESUBMISSION_REQUIRED] || 0) /
        totalCount) *
      100;
    const pending =
      ((countByStatus[UserVerificationStatus.PENDING] || 0) / totalCount) * 100;

    // Round to 2 decimal places
    const approvedRounded = Math.round(approved * 100) / 100;
    const resubmissionRounded = Math.round(resubmission * 100) / 100;
    const pendingRounded = Math.round(pending * 100) / 100;
    const sumRounded = approvedRounded + resubmissionRounded + pendingRounded;
    if (sumRounded !== 100) {
      const difference = 100 - sumRounded;
      const percentages = [
        { key: 'approved', value: approvedRounded },
        { key: 'resubmission', value: resubmissionRounded },
        { key: 'pending', value: pendingRounded },
      ];
      const largest = percentages.reduce((prev, current) =>
        prev.value > current.value ? prev : current,
      );

      if (largest.key === 'approved') {
        return {
          approvedPercentage: approvedRounded + difference,
          resubmissionPercentage: resubmissionRounded,
          pendingPercentage: pendingRounded,
        };
      } else if (largest.key === 'resubmission') {
        return {
          approvedPercentage: approvedRounded,
          resubmissionPercentage: resubmissionRounded + difference,
          pendingPercentage: pendingRounded,
        };
      } else {
        return {
          approvedPercentage: approvedRounded,
          resubmissionPercentage: resubmissionRounded,
          pendingPercentage: pendingRounded + difference,
        };
      }
    }

    return {
      approvedPercentage: approvedRounded,
      resubmissionPercentage: resubmissionRounded,
      pendingPercentage: pendingRounded,
    };
  }

  async findApprovedUserCounts(
    range: 'today' | 'week' | 'month' | 'year',
  ): Promise<ApprovedUserCountResponseDto[]> {
    const {
      dateTruncFormat,
      interval,
      seriesRange,
      periodInterval,
      labelType,
    } = getDateRangeConfig(range);

    let query = '';

    if (labelType === 'day') {
      // week view (daily breakdown)
      query = `
     WITH date_series AS (
      SELECT generate_series(
        DATE_TRUNC('day', CURRENT_DATE - INTERVAL '6 days'),
        DATE_TRUNC('day', CURRENT_DATE),
        INTERVAL '1 day'
      ) AS date_series
    )
    SELECT
      TO_CHAR(date_series, 'DD Mon') AS label,
      COALESCE(COUNT("users"."id"), 0)::text AS count
    FROM date_series
    LEFT JOIN "users"
      ON DATE_TRUNC('day', date_series) = DATE_TRUNC('day', "users"."created_at")
      AND "users"."verification_status" = 'APPROVED'
    GROUP BY date_series
    ORDER BY date_series
    `;
    } else if (labelType === 'week') {
      // month view (weekly breakdown)
      query = `
      WITH date_series AS (
        SELECT generate_series(
          DATE_TRUNC('${seriesRange}', CURRENT_DATE - INTERVAL '${periodInterval}'),
          DATE_TRUNC('${seriesRange}', CURRENT_DATE),
          INTERVAL '${interval}'
        ) AS date_series
      )
      SELECT
        'Week ' || (1 + EXTRACT(WEEK FROM date_series) - EXTRACT(WEEK FROM DATE_TRUNC('month', CURRENT_DATE))) AS label,
        COALESCE(COUNT("users"."id"), 0)::text AS count
      FROM date_series
      LEFT JOIN "users"
        ON DATE_TRUNC('day', "users"."created_at") >= date_series
          AND DATE_TRUNC('day', "users"."created_at") < (date_series + INTERVAL '7 days')
          AND "users"."verification_status" = 'APPROVED'
      GROUP BY date_series
      ORDER BY date_series
    `;
    } else if (labelType === 'month') {
      // year view (monthly breakdown)
      query = `
      WITH date_series AS (
        SELECT generate_series(
          DATE_TRUNC('${seriesRange}', CURRENT_DATE - INTERVAL '${periodInterval}'),
          DATE_TRUNC('${seriesRange}', CURRENT_DATE),
          INTERVAL '${interval}'
        ) AS date_series
      )
      SELECT
        TO_CHAR(date_series, 'FMMonth YYYY') AS label, 
        COALESCE(COUNT("users"."id"), 0)::text AS count
      FROM date_series
      LEFT JOIN "users"
        ON DATE_TRUNC('${dateTruncFormat}', date_series) = DATE_TRUNC('${dateTruncFormat}', "users"."created_at")
        AND "users"."verification_status" = 'APPROVED'
      GROUP BY date_series
      ORDER BY date_series
    `;
    }

    const result = await this.dataSource.query(query);
    return result;
  }
}
