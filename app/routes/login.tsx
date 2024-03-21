import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";

export async function action({ request }: ActionFunctionArgs) {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  /*  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });*/

  const session = await getSession(request.headers.get("cookie"));
  const error = session.get(authenticator.sessionErrorKey);
  return json(
    { error },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <Form method="post">
      {error?.message && <div>{error.message}</div>}
      <label>
        username: <input type="username" name="username" required />
      </label>
      <br />
      <label>
        password:{" "}
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
      </label>
      <br />
      <button>Sign In</button>
    </Form>
  );
}
