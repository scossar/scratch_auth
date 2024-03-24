import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { findUserByEmail } from "~/services/user";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  let user;
  if (email) {
    user = await findUserByEmail(email);
  }

  const emailExists = user ? true : false;

  return json({ emailExists: emailExists });
};
