import type { ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  Link,
  useActionData,
  useSearchParams,
  useLoaderData,
} from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  let fieldErrors = {
    usernameOrEmail: null,
    password: null,
  };
  let fields = {
    usernameOrEmail: "",
    password: "",
  };

  return json({ fields, fieldErrors });
};

export default function Login() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Form method="post">
        <label htmlFor="username-or-email">Username or Email</label>
        <input
          type="text"
          id="username-or-email"
          defaultValue={actionData?.fields?.usernameOrEmail}
          aria-invalid={Boolean(actionData?.fieldErrors?.usernameOrEmail)}
          aria-errormessage={
            actionData?.fieldErrors?.usernameOrEmail
              ? "Username or Email error"
              : ""
          }
        />
        {actionData?.fieldErrors?.usernameOrEmail && (
          <p>{actionData.fieldErrors.usernameOrEmail}</p>
        )}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          defaultValue={actionData?.fields?.password}
          aria-invalid={Boolean(actionData?.fieldErrors?.password)}
          aria-errormessage={
            actionData?.fieldErrors?.password ? "Password error" : ""
          }
        />
        {actionData?.fieldErrors?.password && (
          <p>{actionData.fieldErrors.password}</p>
        )}
        <button type="submit">Login</button>
      </Form>
      <Link to="/register">Register an account</Link>
    </div>
  );
}
