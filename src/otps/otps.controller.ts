import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { I18nTranslationService } from '@src/i18n/i18n.service';
import { ResponseKey } from '@src/i18n/translation-keys';
import { GcCmsOtp } from '@src/otps/domain/otp';
import { VerifyOtpDto } from '@src/otps/dto/verify-otp.dto';
import { ApiKeyGuard } from '@src/utils/guards/api-key.guard';

import { CreateOtpDto } from './dto/create-otp.dto';
import { OtpsService } from './otps.service';

@ApiTags('Otps')
@UseGuards(ApiKeyGuard)
@Controller({
  path: 'otps',
  version: '1',
})
export class OtpsController {
  constructor(
    private readonly otpsService: OtpsService,
    private readonly i18n: I18nTranslationService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    type: GcCmsOtp,
  })
  create(
    @Body() createOtpDto: CreateOtpDto,
  ): Promise<{ data: Promise<string> }> {
    return this.otpsService.create(createOtpDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP' })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
  ): Promise<{ data: string }> {
    await this.otpsService.verify(verifyOtpDto);
    return { data: await this.i18n.translate(ResponseKey.OTP_VERIFIED) };
  }
}
