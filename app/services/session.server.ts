import { createCookieSessionStorage } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { AuthorizationError } from "remix-auth";
import { db } from "./db.server";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable not set");
}

const sessionSecret: string = process.env.SESSION_SECRET as string;

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

// The Remix Auth docs indicate that this is optional. I think
// what that means is that either `sessionStorage` can be exported
// as it is above, or the individual methods can be exported.
export let { getSession, commitSession, destroySession } = sessionStorage;

interface LoginForm {
  username: string;
  password: string;
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new AuthorizationError("Bad credentials: user not found.");
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    throw new AuthorizationError("Bad credentials: wrong password!");
  }

  return user;
}
