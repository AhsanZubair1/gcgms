type ViewConst = { name: string; expression: string };

export const USER_SUMMARY_VIEW: ViewConst = {
  name: 'user_summary_view',
  expression: `
    SELECT
      u.id,
      u.email
    FROM "users" u
  `,
};
