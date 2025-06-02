import { Injectable } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { retry } from 'rxjs';

import { UserCategory } from '@src/categories/enum/user-category.enum';
import { EVENTS } from '@src/common/constants';
import { FORBIDDEN, NOT_FOUND } from '@src/common/exceptions';
import { ApprovedUserCountResponseDto } from '@src/dashboards/dto/approved-user-count.dto';
import { VerificationStatusPercentageDto } from '@src/dashboards/dto/verification-status-percentage.dto';
import { EventService } from '@src/event/event.service';
import { FilesService } from '@src/files/files.service';
import { FilesS3Service } from '@src/files/infrastructure/uploader/s3/files.service';
import { I18nTranslationService } from '@src/i18n/i18n.service';
import { ErrorKey, ResponseKey } from '@src/i18n/translation-keys';
import { SessionService } from '@src/session/session.service';
import { ReasonResponseDto } from '@src/users/dto/reason-response.dto';
import { UpdateUserStatusDto } from '@src/users/dto/update-user-status.dto';
import { UpdateDto } from '@src/users/dto/update.dto';
import {
  customDateRangetype,
  DateRangeOption,
} from '@src/users/dto/user-filter.dto';
import { NullableUserWithFamily } from '@src/users/dto/user-with-family.dto';
import { UserResponseDto } from '@src/users/dto/users-res.dto';
import { PaginationResponseDto } from '@src/utils/dto/pagination-response.dto';
import { UserVerificationStatus } from '@src/utils/enums/user-verification.enum';
import { DeepPartial } from '@src/utils/types/deep-partial.type';
import { NullableType } from '@src/utils/types/nullable.type';
import { IPaginationOptions } from '@src/utils/types/pagination-options';
import { UserSummary } from '@src/views/domain/user-summary';
import { ViewsService } from '@src/views/views.service';

import { GcCmsUser } from './domain/gc-cms-user';
import { User } from './domain/user';
import { UserAbstractRepository } from './infrastructure/persistence/user.abstract.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserAbstractRepository,
    private readonly filesService: FilesService,
    private readonly filesS3Service: FilesS3Service,
    private readonly viewsService: ViewsService,
    private readonly sessionService: SessionService,
    private readonly i18n: I18nTranslationService,
    private readonly evntService: EventService,
  ) {}

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
    return this.usersRepository.findManyWithPagination({
      filterOptions,
    });
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
    return this.usersRepository.findApprovedManyWithPagination({
      filterOptions,
    });
  }

  async findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  async findGcCmsUserById(
    id: GcCmsUser['id'],
  ): Promise<NullableType<GcCmsUser>> {
    return this.usersRepository.findGcCmsUserById(id);
  }

  async profile(id: GcCmsUser['id']): Promise<NullableType<GcCmsUser>> {
    const user = await this.usersRepository.findGcCmsUserById(id);
    if (!user?.profilePicture) {
      return user;
    }
    if (user?.profilePicture) {
      user.profilePicture = await this.filesS3Service.getFileUrl(
        user.profilePicture,
      );
    }
    return user;
  }

  async findByEmail(
    email: GcCmsUser['email'],
  ): Promise<NullableType<GcCmsUser>> {
    return this.usersRepository.findByEmail(email);
  }

  async findByMilitaryId(militaryId: string): Promise<NullableType<User>> {
    return this.usersRepository.findByMilitaryId(militaryId);
  }

  async findByMykadId(mykadId: string): Promise<NullableType<User>> {
    const user = await this.usersRepository.findByMykadId(mykadId);

    if (user?.selfie) {
      user.selfie = await this.filesS3Service.getFileUrl(user.selfie);
    }
    if (user?.militaryIdImage) {
      user.militaryIdImage = await this.filesS3Service.getFileUrl(
        user.militaryIdImage,
      );
    }
    return user;
  }

  async getVerificationStatusPercentage(): Promise<
    VerificationStatusPercentageDto[]
  > {
    const percentage =
      await this.usersRepository.getVerificationStatusPercentage();
    return [percentage];
  }

  async findApprovedByMykadId(
    mykadId: string,
  ): Promise<NullableUserWithFamily> {
    const user = await this.usersRepository.findApprovedByMykadId(mykadId);

    if (user?.selfie) {
      user.selfie = await this.filesS3Service.getFileUrl(user.selfie);
    }
    if (user?.militaryIdImage) {
      user.militaryIdImage = await this.filesS3Service.getFileUrl(
        user.militaryIdImage,
      );
    }
    return user;
  }

  findAllreasonsAsync(categoryId: string): Promise<{
    resubmitReasons: ReasonResponseDto[];
    rejectReasons: ReasonResponseDto[];
  }> {
    return this.usersRepository.getReasonsByCategory(categoryId);
  }

  async updateStatusupdateUserStatus(
    updateUserStatusDto: UpdateUserStatusDto,
    cmsUserId: string,
  ): Promise<any> {
    const user = await this.usersRepository.findByMykadId(
      updateUserStatusDto.mykadId,
    );
    const update = await this.usersRepository.updateUserStatus(
      updateUserStatusDto,
      cmsUserId,
    );
    if (user && update) {
      this.evntService.emitAsync(EVENTS.userStatus, {
        status: updateUserStatusDto.status,
        userId: user.id,
      });
    }
    return this.i18n.translate(ResponseKey.USER_STATUS_APPROVED);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<NullableType<User>> {
    return this.usersRepository.findByPhoneNumber(phoneNumber);
  }

  async update(
    id: GcCmsUser['id'],
    payload: DeepPartial<GcCmsUser>,
  ): Promise<GcCmsUser> {
    const clonedPayload = { ...payload };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userByEmail = await this.usersRepository.findByEmail(
        clonedPayload.email,
      );
      if (userByEmail && userByEmail.id !== id) {
        throw FORBIDDEN(ErrorKey.INVALID_EMAIL, 'email');
      }
    }
    return this.usersRepository.update(id, clonedPayload);
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateDto,
  ): Promise<{ data: string }> {
    let file;
    if (updateProfileDto.idImageS3Key) {
      file = await this.filesService.create({
        path: updateProfileDto.idImageS3Key,
        type: 'PROFILE_IMAGE',
        userId: null,
        eppId: null,
      });
    }

    await this.usersRepository.update(userId, {
      ...updateProfileDto,
      profilePictureId: file.id,
    });
    return {
      data: await this.i18n.translate(ResponseKey.PROFILE_UPDATED),
    };
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async hardDelete(id: User['id']): Promise<void> {
    await this.sessionService.deleteByUserId({ userId: id });
    await this.usersRepository.hardDelete(id);
  }

  async restore(id: User['id']): Promise<void> {
    await this.usersRepository.restore(id);
  }

  async permanentlyDelete(id: User['id']): Promise<void> {
    await this.usersRepository.permanentlyDelete(id);
  }

  async findAndValidate(
    field: keyof User,
    value: any,
    fetchRelations = false,
  ): Promise<User> {
    const user = fetchRelations
      ? await this.usersRepository.findByIdWithRelations(value)
      : await this.usersRepository.findById(value);

    if (!user) {
      throw NOT_FOUND('User', { [field]: value });
    }
    return user;
  }

  async getUserByProviderAndIdentifier(
    provider: UserCategory,
    identifierValue: string,
  ): Promise<User> {
    const user = await this.usersRepository.findByProviderAndIdentifier(
      provider,
      identifierValue,
    );
    if (!user) {
      throw NOT_FOUND('User');
    }
    return user;
  }

  async getUsersSummary(): Promise<UserSummary[]> {
    return this.viewsService.getUsersSummary();
  }

  async getUserSummary(id: User['id']): Promise<NullableType<UserSummary>> {
    const userSummaryView = this.viewsService.getUsersSummaryView();
    return this.usersRepository.getUserSummary(id, userSummaryView);
  }

  async countUsers(filterOptions?: {
    verificationStatus?: UserVerificationStatus;
    baseCamp?: string;
    armedForceBranch?: string;
    userCategory?: string;
    biometricLogin?: boolean;
  }): Promise<number> {
    return this.usersRepository.count(filterOptions);
  }

  findApprovedUserCounts(
    range: 'week' | 'month' | 'year',
  ): Promise<ApprovedUserCountResponseDto[]> {
    return this.usersRepository.findApprovedUserCounts(range);
  }
}
