import { registerDecorator, ValidationOptions } from 'class-validator';

import { ErrorKey } from '@src/i18n/translation-keys';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName,
      options: {
        message: ErrorKey.PASSWORD_CRITERIA_FAILED,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (!value) return true; // skip if empty, handled by IsOptional
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/.test(value);
        },
      },
    });
  };
}
