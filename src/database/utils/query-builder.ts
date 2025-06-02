import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export type QueryBuilder<T extends ObjectLiteral> = SelectQueryBuilder<T>;
