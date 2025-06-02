import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data?: T;
  hasNextPage?: boolean;
  jobId?: string;
  statusUrl?: string;
  error?: string | Record<string, any>;
  details?: any;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map(async (data) => {
        try {
          // Handle void/empty responses
          if (data === undefined || data === null) {
            response.status(HttpStatus.OK);
            return {
              statusCode: HttpStatus.OK,
              message: 'Success',
            };
          }

          // Handle async job responses
          if (data instanceof Promise && data['pending']) {
            response.status(HttpStatus.ACCEPTED);
            return {
              statusCode: HttpStatus.ACCEPTED,
              message: 'Request is being processed',
              isAsync: true,
              jobId: data['jobId'],
              statusUrl: data['jobId'] ? `/status/${data['jobId']}` : undefined,
            };
          }

          const resolvedData = data instanceof Promise ? await data : data;

          // Handle empty data responses
          if (!resolvedData) {
            response.status(HttpStatus.BAD_REQUEST);
            return {
              statusCode: HttpStatus.BAD_REQUEST,
              message: 'Request could not be processed',
            };
          }

          const message = resolvedData?.message ?? 'success';

          // Handle paginated responses
          if (resolvedData && typeof resolvedData === 'object') {
            if ('data' in resolvedData && 'hasNextPage' in resolvedData) {
              return {
                statusCode: response.statusCode || HttpStatus.OK,
                message,
                data: resolvedData.data,
                hasNextPage: resolvedData.hasNextPage,
                ...(resolvedData.pageNumber && {
                  pageNumber: resolvedData.pageNumber,
                }),
                ...(resolvedData.totalRecords && {
                  totalRecords: resolvedData.totalRecords,
                }),
                ...(resolvedData.pageLimit && {
                  pageLimit: resolvedData.pageLimit,
                }),
                ...(resolvedData.from && { from: resolvedData.from }),
                ...(resolvedData.to && { to: resolvedData.to }),
              };
            }

            // Handle result wrapper pattern
            if ('result' in resolvedData) {
              const result = resolvedData.result;
              return {
                statusCode: response.statusCode || HttpStatus.OK,
                message,
                ...(result?.data && { data: result.data }),
                ...(result?.hasNextPage && { hasNextPage: result.hasNextPage }),
              };
            }
          }

          // Default successful response
          return {
            statusCode: response.statusCode || HttpStatus.OK,
            message,
            data: resolvedData,
          };
        } catch (error) {
          console.error('Response transformation error:', error);
          throw error;
        }
      }),
      mergeMap((value) => value),
      catchError((error) => {
        // Handle validation errors (422 Unprocessable Entity)
        if (error.status === HttpStatus.UNPROCESSABLE_ENTITY) {
          response.status(HttpStatus.UNPROCESSABLE_ENTITY);
          return throwError(() => ({
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            message: 'Unprocessable Entity Exception',
            error:
              'UnprocessableEntityException: Unprocessable Entity Exception',
            details: {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors:
                error.response?.errors ||
                error.response?.message ||
                error.response,
            },
          }));
        }

        // Handle validation errors (BadRequestException with array of constraints)
        if (
          error instanceof BadRequestException &&
          error.getResponse()['message']?.length
        ) {
          const validationResponse = error.getResponse();
          response.status(HttpStatus.BAD_REQUEST);
          return throwError(() => ({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Validation failed',
            error: validationResponse['message'] || validationResponse,
          }));
        }

        // Handle ForbiddenException with 400 status
        if (error instanceof ForbiddenException) {
          response.status(HttpStatus.BAD_REQUEST);
          return throwError(() => ({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Request could not be completed',
            error: error.message,
          }));
        }

        // Handle other errors
        console.error('Interceptor caught error:', error);
        const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status);
        return throwError(() => ({
          statusCode: status,
          message: error.message || 'Internal server error',
          ...(process.env.NODE_ENV === 'development' && {
            error: error.stack,
            ...(error.response && { details: error.response }),
          }),
        }));
      }),
    );
  }
}
