import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid from '@sendgrid/mail';

import { UNPROCESSABLE_ENTITY } from '@src/common/exceptions';
import { AllConfigType } from '@src/config/config.type';
import { ErrorKey } from '@src/i18n/translation-keys';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService<AllConfigType>) {
    const apiKey = this.configService.get('mail.sandGridApiKey', {
      infer: true,
    });
    if (!apiKey) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.INVALID_EMAIL, 'email');
    }
    SendGrid.setApiKey(apiKey!);
  }

  async sendMail(
    to: string,
    templateId: string,
    data: { [key: string]: any },
    ccEmail: boolean = false,
  ): Promise<void> {
    try {
      const senderEmail = this.configService.get('mail.senderEmail', {
        infer: true,
      });
      const ccMail = this.configService.get('mail.ccMail', {
        infer: true,
      });

      const payload: SendGrid.MailDataRequired = {
        to,
        from: senderEmail!,
        templateId,
        dynamicTemplateData: data,
      };
      if (ccEmail) {
        payload.cc = ccMail;
      }
      await SendGrid.send(payload);
    } catch (error) {
      throw UNPROCESSABLE_ENTITY(ErrorKey.INVALID_EMAIL, 'email');
    }
  }
}
