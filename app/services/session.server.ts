import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { db } from "./db.server";
import type { FieldError } from "~/components/LoginForm";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable not set");
}

const sessionSecret: string = process.env.SESSION_SECRET as string;

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "z_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export let { getSession, commitSession, destroySession } = sessionStorage;

export async function createUserSession(userId: number, redirectTo: string) {
  const session = await getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

interface LoginForm {
  usernameOrEmail: string;
  password: string;
}

interface LoginSuccess {
  user: {
    id: number;
    usernameOrEmail: string;
  };
}

interface LoginFailure {
  fieldError: FieldError;
}

type LoginResult = LoginSuccess | LoginFailure;

export async function login({
  usernameOrEmail,
  password,
}: LoginForm): Promise<LoginResult> {
  const user = await db.user.findFirst({
    where: {
      OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    },
  });

  if (!user) {
    return {
      fieldError: { key: "usernameOrEmail", message: "User not found" },
    };
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return { fieldError: { key: "password", message: "Incorrect password" } };
  }

  return { user: { id: user.id, usernameOrEmail } };
}
