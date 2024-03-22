import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import LoginForm from "~/components/LoginForm";

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

export default function Login() {
  const actionData = useActionData<typeof action>();
  const fields = actionData?.fields;
  const fieldErrors = actionData?.fieldErrors;
  const formError = actionData?.formError;

  return (
    <div>
      <h1 className="text-2xl">Log In</h1>
      <LoginForm
        fields={fields}
        fieldErrors={fieldErrors}
        formError={formError}
      />
    </div>
  );
}
