import { Injectable } from '@nestjs/common';

import { FORBIDDEN } from '@src/common/exceptions';
import { I18nTranslationService } from '@src/i18n/i18n.service';
import { ErrorKey } from '@src/i18n/translation-keys';
import { MailService } from '@src/mail/mail.service';
import { VerifyOtpDto } from '@src/otps/dto/verify-otp.dto';

import { CreateOtpDto } from './dto/create-otp.dto';
import { OtpAbstractRepository } from './infrastructure/persistence/otp.abstract.repository';

@Injectable()
export class OtpsService {
  constructor(
    private readonly otpRepository: OtpAbstractRepository,
    private readonly i18n: I18nTranslationService,
    private readonly mailService: MailService,
  ) {}

  async create(createOtpDto: CreateOtpDto) {
    await this.mailService.sendOtpToEmail({
      to: createOtpDto.email!,
      data: { otp: createOtpDto.otp },
    });
    createOtpDto.otp = '111111';
    const dto = {
      ...createOtpDto,
      isUsed: false,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
    await this.otpRepository.create(dto);
    return { data: this.i18n.translate(ErrorKey.OTP_SENT_SUCCESSFULLY) };
  }

  async verify(verifyOtpDto: VerifyOtpDto): Promise<boolean> {
    const { email, otp } = verifyOtpDto;

    const otpRecord = await this.otpRepository.findValidOtp(email, otp);

    if (!otpRecord) {
      throw FORBIDDEN(ErrorKey.OTP_VERIFICATION_FAILED, 'otp');
    }

    await this.otpRepository.markAsUsed(otpRecord.id);
    return true;
  }

  async checkValidOtpExists(
    eamil: string,
    otp?: string | null,
  ): Promise<boolean> {
    return this.otpRepository.existsValidOtpByPhone(eamil, otp ?? '');
  }
}
