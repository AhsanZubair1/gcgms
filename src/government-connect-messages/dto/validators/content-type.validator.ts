// validators/content-type.validator.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

import {
  ContentTypeEnum,
  CreateContentDto,
} from '@src/government-connect-messages/dto/create-article.dto';
import { MessageCategoryEnum } from '@src/government-connect-messages/enum/message-type.enum';

@ValidatorConstraint({ name: 'isValidContentTypeCombination', async: false })
export class IsValidContentTypeCombinationConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    const object = args.object as CreateContentDto;

    // For FOCUS NEWS, only articles are allowed
    if (object.messageType === MessageCategoryEnum.FOCUS_NEWS) {
      return object.contentType === ContentTypeEnum.ARTICLE;
    }

    // For other types, both content types are allowed
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as CreateContentDto;
    if (object.messageType === MessageCategoryEnum.FOCUS_NEWS) {
      return 'FOCUS NEWS messages must be of type ARTICLE';
    }
    return 'Invalid content type combination';
  }
}

export function IsValidContentTypeCombination(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidContentTypeCombinationConstraint,
    });
  };
}
