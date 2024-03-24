import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findUserByUsernameOrEmail } from "~/services/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  let user, emailExists, usernameExists;
  if (email) {
    user = await findUserByUsernameOrEmail(email);
    emailExists = user ? true : false;
  }
  const username = url.searchParams.get("username");
  if (username) {
    user = await findUserByUsernameOrEmail(username);
    usernameExists = user ? true : false;
  }

  return json({ usernameExists: usernameExists, emailExists: emailExists });
};
