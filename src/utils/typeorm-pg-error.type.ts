// src/types/typeorm-pg-error.type.ts
export interface TypeOrmPgError extends Error {
  code?: string;
  detail?: string;
  table?: string;
  constraint?: string;
  schema?: string;
  column?: string;
  where?: string;
  severity?: string;
  routine?: string;
}

export interface TypeOrmQueryFailedError extends Error {
  driverError: TypeOrmPgError;
  query?: string;
  parameters?: any[];
}
