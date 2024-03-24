import { db } from "./db.server";

export const findUserByUsernameOrEmail = async (usernameOrEmail: string) => {
  const user = await db.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });
  return user;
};
