import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { ErrorKey, ResponseKey } from './translation-keys';

@Injectable()
export class I18nTranslationService {
  constructor(private readonly i18nService: I18nService) {}

  // RESPONSE MESSAGES
  async otpVerified(lang?: string): Promise<string> {
    return this.translate(ResponseKey.OTP_VERIFIED, {}, lang);
  }

  // GENERIC METHOD
  async translate(
    key: string | ErrorKey | ResponseKey,
    args?: Record<string, any>,
    lang?: string,
  ): Promise<string> {
    const i18n = I18nContext.current();
    const language = lang || i18n?.lang || 'en';

    try {
      // Convert enum to string if needed
      const keyString = typeof key === 'string' ? key : String(key);

      // Try to translate with the full key (including namespace if present)
      const result = await this.i18nService.translate(keyString, {
        lang: language,
        args,
      });

      // If we got the key back and it doesn't include a namespace, try with error-messages namespace
      if (result === keyString && !keyString.includes('.')) {
        const namespacedKey = `error-messages.${keyString}`;
        const namespacedResult = await this.i18nService.translate(
          namespacedKey,
          {
            lang: language,
            args,
          },
        );
        if (namespacedResult !== namespacedKey) {
          return namespacedResult as string;
        }
      }

      return result as string;
    } catch (error: unknown) {
      // Fallback if translation not found
      console.error(`Translation not found for key: ${key}`, error);
      return typeof key === 'string' ? key : String(key);
    }
  }
}
