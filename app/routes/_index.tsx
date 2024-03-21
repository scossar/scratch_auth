import { json } from "@remix-run/node";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);

  return json({ user: user });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.logout(request, {
    redirectTo: "/login",
  });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Remix Auth Test</h1>
      {user && (
        <>
          <p>Hey, you're logged in. Give logging out a try!</p>
          <Form method="post">
            <button type="submit">Logout</button>
          </Form>
        </>
      )}
    </div>
  );
}
