export type AuthUserType = {
  id: string;
  category: string;
  sessionId: string;
  roles?: Array<string>;
  permissions?: Array<string>;
};
