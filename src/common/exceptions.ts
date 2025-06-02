import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';

import { ErrorKey } from '@src/i18n/translation-keys';

export const NOT_FOUND = (
  key: string,
  attributes: string | { [key: string]: any } = {},
) => {
  const hasAttributes =
    typeof attributes === 'string' || Object.keys(attributes).length > 0;
  const hasValue =
    typeof attributes === 'object' &&
    Object.values(attributes)[0] !== undefined;

  const error = {
    message: key,
    attribute:
      typeof attributes === 'string'
        ? attributes
        : hasAttributes
          ? Object.keys(attributes)[0]
          : 'key',
    value:
      typeof attributes === 'string'
        ? undefined
        : hasAttributes
          ? Object.values(attributes)[0]
          : key,
  };

  const args = {
    key,
    field: error.attribute,
    value: error.value,
  };

  return new NotFoundException({
    statusCode: HttpStatus.NOT_FOUND,
    errors: {
      [error.attribute]: hasValue
        ? ErrorKey.NOT_FOUND
        : ErrorKey.NOT_FOUND_WITHOUT_VALUE,
    },
    args: {
      [error.attribute]: args,
    },
  });
};

export const BAD_REQUEST = (
  message: string,
  attribute?: string,
  stack?: Error,
) => {
  const error = {
    message,
    attribute: attribute || 'error',
  };

  return new BadRequestException({
    statusCode: HttpStatus.BAD_REQUEST,
    errors: {
      [error.attribute]: message,
    },
    args: {
      [error.attribute]: {
        key: message,
        field: error.attribute,
      },
    },
    stack: stack || 'No stack trace available',
  });
};

export const INTERNAL_SERVER = (
  message: string,
  attribute?: string,
  stack?: Error,
) => {
  const error = {
    message,
    attribute: attribute || 'error',
  };

  return new InternalServerErrorException({
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errors: {
      [error.attribute]: message,
    },
    args: {
      [error.attribute]: {
        key: message,
        field: error.attribute,
      },
    },
    stack: stack || 'No stack trace available',
  });
};

export const UNPROCESSABLE_ENTITY = (
  message: string,
  attribute: string,
  stack?: Error,
  repository?: string,
  method?: string,
) => {
  return new UnprocessableEntityException({
    statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    errors: {
      [attribute]: message,
    },
    args: {
      [attribute]: {
        key: message,
        field: attribute,
        repository,
        method,
      },
    },
    stack: stack || 'No stack trace available',
  });
};

export const UNAUTHORIZED = (
  message: string,
  attribute: string,
  stack?: Error,
) => {
  return new UnauthorizedException({
    statusCode: HttpStatus.UNAUTHORIZED,
    errors: {
      [attribute]: message,
    },
    args: {
      [attribute]: {
        key: message,
        field: attribute,
      },
    },
    stack: stack || 'No stack trace available',
  });
};

export const FORBIDDEN = (
  message: string,
  attribute: string,
  stack?: Error,
) => {
  return new ForbiddenException({
    statusCode: HttpStatus.FORBIDDEN,
    errors: {
      [attribute]: message,
    },
    args: {
      [attribute]: {
        key: message,
        field: attribute,
      },
    },
    stack: stack || 'No stack trace available',
  });
};

export const CustomException = (
  message: string,
  attribute: string,
  stack?: Error,
) => {
  return new ConflictException({
    statusCode: HttpStatus.CONFLICT,
    errors: {
      [attribute]: message,
    },
    args: {
      [attribute]: {
        key: message,
        field: attribute,
      },
    },
    stack: stack || 'No stack trace available',
  });
};
