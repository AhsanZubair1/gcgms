import { PaginationResponseDto } from '@src/utils/dto/pagination-response.dto';

import { pagination } from './pagination';
import { IPaginationOptions } from './types/pagination-options';

//mock type for testing purposes
type MockDataType = { id: number; name: string };

describe('Pagination', () => {
  let data: MockDataType[];
  let options: IPaginationOptions;

  beforeEach(() => {
    //mock data
    data = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];

    //pagination options
    options = {
      page: 1,
      limit: 3,
    };
  });

  it('should return correct pagination structure', () => {
    const total = 10;

    const result: PaginationResponseDto<MockDataType> = pagination(
      data,
      total,
      options,
    );

    expect(result).toEqual({
      data,
      hasNextPage: true,
      totalRecords: total,
      pageNumber: options.page,
      pageLimit: options.limit,
      from: 1,
      to: 3,
    });
  });

  it('should calculate "from" and "to" correctly when on page 2', () => {
    options.page = 2;
    const total = 10;

    const result: PaginationResponseDto<MockDataType> = pagination(
      data,
      total,
      options,
    );

    expect(result.from).toBe(4);
    expect(result.to).toBe(6);
  });

  it('should set "hasNextPage" to false if there are no more pages', () => {
    const limitedData = [{ id: 1, name: 'Item 1' }]; // Less than the limit
    const total = 4;

    const result: PaginationResponseDto<MockDataType> = pagination(
      limitedData,
      total,
      options,
    );

    expect(result.hasNextPage).toBe(false);
  });

  it('should handle empty data array correctly', () => {
    const emptyData: MockDataType[] = [];
    const total = 0;

    const result: PaginationResponseDto<MockDataType> = pagination(
      emptyData,
      total,
      options,
    );

    expect(result.data).toEqual([]);
    expect(result.hasNextPage).toBe(false);
    expect(result.totalRecords).toBe(0);
    expect(result.pageNumber).toBe(1);
    expect(result.pageLimit).toBe(options.limit);
    expect(result.from).toBe(0);
    expect(result.to).toBe(0);
  });
});
