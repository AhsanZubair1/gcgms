import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AllConfigType } from '@src/config/config.type';
import { MailerService } from '@src/mailer/mailer.service';

import { MailData } from './interfaces/mail-data.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async sendOtpToEmail(mailData: MailData<{ otp: string }>): Promise<void> {
    const payload: any = {};
    await this.mailerService.sendMail(
      mailData.to,
      'd-ff6e541bdd9a4dfbbcf64ee147e68efc',
      { ...payload, otp: mailData.data.otp },
    );
  }
}
