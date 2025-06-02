import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LocalizationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const i18n = I18nContext.current();
    const lang = i18n?.lang || 'en';

    const localize = (value: any): any => {
      if (Array.isArray(value)) {
        return value.map(localize);
      } else if (value && typeof value === 'object') {
        const newObj = { ...value };
        for (const key of Object.keys(newObj)) {
          const prop = newObj[key];
          if (
            prop &&
            typeof prop === 'object' &&
            typeof prop.en === 'string' &&
            typeof prop.ms === 'string'
          ) {
            newObj[key] = prop[lang] || prop['en']; // fallback to 'en'
          } else {
            newObj[key] = localize(prop);
          }
        }
        return newObj;
      }
      return value;
    };

    return next.handle().pipe(map((data) => localize(data)));
  }
}
