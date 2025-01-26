import { z } from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Selectable } from 'kysely';

export const paginationParamsSchema = z.object({
  page: z.preprocess((input) => {
    if (typeof input === 'string') {
      const parsed = parseInt(input, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return input;
  }, z.number().min(1).max(50).default(1)),

  limit: z.preprocess((input) => {
    if (typeof input === 'string') {
      const parsed = parseInt(input, 10);
      return isNaN(parsed) ? undefined : parsed;
    }
    return input;
  }, z.number().min(1).max(100).default(10)),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export class PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'Page number',
    minimum: 1,
    maximum: 100,
  })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Limit number',
    minimum: 1,
    maximum: 50,
  })
  limit?: number = 10;
}

export interface Page<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  nbHits: number;
}

export const applyPagination = (
  query: Selectable<any>,
  params?: PaginationParams,
) => {
  if (!params) {
    return query;
  }
  return query.offset((params.page - 1) * params.limit).limit(params.limit);
};
