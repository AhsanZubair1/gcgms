import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

import { GcCmsOtp } from '@src/otps/domain/otp';
import { OtpAbstractRepository } from '@src/otps/infrastructure/persistence/otp.abstract.repository';
import { GcCmsOtpEntity } from '@src/otps/infrastructure/persistence/relational/entities/otp.entity';
import { GcCmsOtpMapper } from '@src/otps/infrastructure/persistence/relational/mappers/otp.mapper';

@Injectable()
export class OtpRelationalRepository implements OtpAbstractRepository {
  constructor(
    @InjectRepository(GcCmsOtpEntity)
    private readonly otpRepository: Repository<GcCmsOtpEntity>,
  ) {}

  async create(data: GcCmsOtp): Promise<GcCmsOtp> {
    const persistenceModel = GcCmsOtpMapper.toPersistence(data);
    const newEntity = await this.otpRepository.save(
      this.otpRepository.create(persistenceModel),
    );
    return GcCmsOtpMapper.toDomain(newEntity);
  }

  async findValidOtp(email: string, otp: string): Promise<GcCmsOtp | null> {
    const record = await this.otpRepository.findOne({
      where: {
        email: email,
        otp,
        is_used: false,
        expires_at: MoreThanOrEqual(new Date()),
      },
      order: { created_at: 'DESC' },
    });

    return record ? GcCmsOtpMapper.toDomain(record) : null;
  }

  async markAsUsed(id: number): Promise<void> {
    await this.otpRepository.update(id, { is_used: true });
  }

  async existsValidOtpByPhone(
    eamil: string,
    otp?: string | null,
  ): Promise<boolean> {
    const condition = {
      email: eamil,
      is_used: true,
      expires_at: MoreThanOrEqual(new Date()),
    };
    if (otp) {
      condition['otp'] = otp;
    }

    const record = await this.otpRepository.findOne({
      where: condition,
    });
    return record !== null;
  }
}
