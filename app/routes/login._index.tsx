import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { createUserSession, login } from "~/services/session.server";
import { badRequest } from "~/services/request.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const usernameOrEmail = form.get("usernameOrEmail");
  const password = form.get("password");

  if (typeof usernameOrEmail !== "string" || typeof password !== "string") {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Form not submitted correctly.",
    });
  }

  const fields = {
    usernameOrEmail,
    password,
  };

  const loginReaponse = await login({
    usernameOrEmail: usernameOrEmail,
    password: password,
  });

  let fieldError, user;
  if ("user" in loginReaponse) {
    user = loginReaponse.user;
  } else if ("fieldError" in loginReaponse) {
    fieldError = loginReaponse.fieldError;
  }

  if (user) {
    return createUserSession(user.id, "/");
  } else if (fieldError?.usernameOrEmail) {
    return badRequest({
      fieldErrors: fieldError,
      fields,
      formError: "User not found",
    });
  } else if (fieldError?.password) {
    return badRequest({
      fieldErrors: fieldError,
      fields,
      formError: "Wrong password",
    });
  } else {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: "Something went wrong",
    });
  }
};

export default function LoginForm() {
  const actionData = useActionData<typeof action>();
  console.log(
    `actionData.fieldErrors: ${JSON.stringify(
      actionData?.fieldErrors,
      null,
      2
    )}`
  );

  return (
    <div>
      <h1 className="text-2xl">Log In</h1>
      <Form
        className="flex flex-col max-w-80 border border-slate-400 p-3"
        method="post"
      >
        <label htmlFor="username-or-email">Username or Email</label>
        <input
          className="border border-slate-600 px-1"
          type="text"
          id="username-or-email"
          name="usernameOrEmail"
          defaultValue={actionData?.fields?.usernameOrEmail}
          aria-invalid={Boolean(actionData?.fieldErrors?.usernameOrEmail)}
          aria-errormessage={
            actionData?.fieldErrors?.usernameOrEmail
              ? "Username or Email error"
              : ""
          }
        />
        {actionData?.fieldErrors?.usernameOrEmail && (
          <p className="text-sm text-red-600">
            {actionData.fieldErrors.usernameOrEmail}
          </p>
        )}
        <label htmlFor="password">Password</label>
        <input
          className="border border-slate-600 px-1"
          type="password"
          id="password"
          name="password"
          defaultValue={actionData?.fields?.password}
          aria-invalid={Boolean(actionData?.fieldErrors?.password)}
          aria-errormessage={
            actionData?.fieldErrors?.password ? "Password error" : ""
          }
        />
        {actionData?.fieldErrors?.password && (
          <p className="text-sm text-red-600">
            {actionData.fieldErrors.password}
          </p>
        )}
        {actionData?.formError && (
          <div className="border border-red-500 p-2 my-2 rounded-sm text-sm">
            {actionData.formError}
          </div>
        )}

        <div className="mt-4">
          <button className="border border-slate-600 w-16" type="submit">
            Login
          </button>
        </div>
      </Form>
      <Link
        className="text-sky-700 text-sm hover:underline"
        to="/login/register"
      >
        Register an account
      </Link>
    </div>
  );
}
