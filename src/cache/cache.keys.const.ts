import { User } from '@src/users/domain/user';

export const CACHE_KEYS = {
  LOGIN_ATTEMPTS: (email: User['email']) => `login-attempts:${email}`,
};
