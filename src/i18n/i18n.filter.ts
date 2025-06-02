import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

import { I18nTranslationService } from './i18n.service';

@Catch(HttpException)
export class I18nExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nTranslationService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as any;
    const errorObj = exceptionResponse.errors || {};

    // Translate error messages if they are error keys
    const translatedErrors = {};
    for (const [attribute, message] of Object.entries(errorObj)) {
      if (typeof message === 'string' && message.includes('.')) {
        try {
          // Get the namespace and key
          const [, key] = message.split('.');
          if (!key) {
            translatedErrors[attribute] = message;
            continue;
          }
          // Pass the full key including namespace
          const translated = await this.i18n.translate(
            message,
            exceptionResponse.args?.[attribute] || { key: attribute },
          );
          translatedErrors[attribute] = translated;
        } catch (e) {
          translatedErrors[attribute] = message;
        }
      } else {
        translatedErrors[attribute] = message;
      }
    }

    response.status(status).json({
      statusCode: status,
      errors: translatedErrors,
      error: exceptionResponse.error,
      message: exceptionResponse.message,
    });
  }
}
