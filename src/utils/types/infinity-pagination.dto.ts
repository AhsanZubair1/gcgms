export class InfinityPaginationResponseDto<T> {
  data: T[];
  meta: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
