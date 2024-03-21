import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "~/services/session.server";
import { login } from "~/services/session.server";
import type { User } from "@prisma/client";
import invariant from "tiny-invariant";

export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let username: FormDataEntryValue | null = form.get("username");
    let password: FormDataEntryValue | null = form.get("password");
    invariant(typeof username === "string", "username must be a string");
    invariant(username.length > 0, "username must not be empty");
    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    let user = await login({ username: username, password: password });

    return user;
  }),

  "user-pass"
);
