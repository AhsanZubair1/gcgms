import { User } from '@sentry/nestjs';

import { NullableType } from '@src/utils/types/nullable.type';

// In your user types file
export interface UserWithFamilyInfo extends User {
  parentName?: string;
  parentUserMyKadId?: string;
}

export type NullableUserWithFamily = NullableType<UserWithFamilyInfo>;
