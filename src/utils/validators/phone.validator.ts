import { registerDecorator, ValidationOptions } from 'class-validator';

import { ErrorKey } from '@src/i18n/translation-keys';

export function IsPKOrMYPhone(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isPKOrMYPhone',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(phone: any) {
          if (typeof phone !== 'string') return false;

          const pkRegex = /^(?:\+92|0)3\d{9}$/;
          const myRegex = /^(?:\+60|0)1\d{8,9}$/;

          return pkRegex.test(phone) || myRegex.test(phone);
        },
        defaultMessage() {
          return ErrorKey.INVALID_PHONE_FORMATE;
        },
      },
    });
  };
}
