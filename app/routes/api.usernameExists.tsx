import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findUserByUsername } from "~/services/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  let user;
  if (username) {
    user = await findUserByUsername(username);
  }

  const usernameExists = user ? true : false;

  return json({ usernameExists: usernameExists });
};
