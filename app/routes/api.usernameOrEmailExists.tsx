import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findUserByUsernameOrEmail } from "~/services/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const usernameOrEmail = url.searchParams.get("usernameOrEmail");
  let user;
  if (usernameOrEmail) {
    user = await findUserByUsernameOrEmail(usernameOrEmail);
  }

  const usernameOrEmailExists = user ? true : false;

  return json({ usernameOrEmailExists: usernameOrEmailExists });
};
