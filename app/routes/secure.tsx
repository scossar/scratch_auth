import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return user;
};

export default function Secure() {
  const user = useLoaderData<typeof loader>();
  console.log(`data from loader: ${JSON.stringify(user, null, 2)}`);

  return <div>this is a test, this is only a test...</div>;
}
