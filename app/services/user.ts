import RegistrationForm from "~/components/RegistrationForm";
import { db } from "./db.server";
import bcrypt from "bcryptjs";

export const findUserByUsernameOrEmail = async (usernameOrEmail: string) => {
  const user = await db.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });
  return user;
};

interface RegistrationForm {
  email: string;
  username: string;
  password: string;
}

interface LoginSuccess {
  user: {
    id: number;
    username: string;
  };
}

// todo: what about registration failures?
export const registerUser = async ({
  email,
  username,
  password,
}: RegistrationForm): Promise<LoginSuccess> => {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { email, username, passwordHash },
  });
  return { user: { id: user.id, username: user.username } };
};
