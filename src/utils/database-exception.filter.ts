// src/filters/typeorm-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

import { TypeOrmQueryFailedError } from '@src/utils/typeorm-pg-error.type';

@Catch(QueryFailedError)
export class TypeOrmExceptionsFilter implements ExceptionFilter {
  catch(exception: TypeOrmQueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const pgError = exception.driverError;

    let statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
    let errors: Record<string, string> = {
      database: 'Database operation failed',
    };
    if (pgError.code) {
      switch (pgError.code) {
        case '23505': {
          // Unique violation
          statusCode = HttpStatus.BAD_REQUEST;

          const detail = pgError.detail || '';
          const fieldMatch = detail.match(/\(([^)]+)\)=\(([^)]+)\)/);
          const fieldName = fieldMatch?.[1];

          if (fieldName) {
            errors = {
              [fieldName]: `${capitalize(fieldName)} already exists`,
            };
          } else {
            errors = {
              database: 'Field already exists',
            };
          }
          break;
        }

        case '23503':
          // Foreign key violation
          errors = { database: 'Related record not found' };
          break;

        case '23502':
          // Not null violation
          if (pgError.column) {
            errors = {
              [pgError.column]: `Missing required value for ${pgError.column}`,
            };
          } else {
            errors = {
              database: 'Missing required value',
            };
          }
          break;

        case '22P02': {
          // Invalid text representation (e.g., invalid UUID)
          statusCode = HttpStatus.BAD_REQUEST;
          const message = pgError.message || '';
          const fieldMatch = message.match(/column "([^"]+)"/);
          const fieldName = fieldMatch?.[1];

          if (fieldName) {
            errors = {
              [fieldName]: `${capitalize(fieldName)} has invalid format`,
            };
          }
          if (pgError.column) {
            errors = {
              [pgError.column]: `${capitalize(
                pgError.column,
              )} has invalid format`,
            };
          } else {
            errors = { database: 'Invalid data format' };
          }
          break;
        }

        case '42703':
          // Undefined column
          statusCode = HttpStatus.BAD_REQUEST;
          errors = { database: 'Invalid field reference' };
          break;
      }
    }

    const errorResponse = {
      statusCode,
      errors,
    };

    response.status(statusCode).json(errorResponse);
  }
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
