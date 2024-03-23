import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";

import LoginForm from "~/components/LoginForm";
import type { FieldError } from "~/components/LoginForm";
import { createUserSession, login } from "~/services/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const usernameOrEmail = form.get("usernameOrEmail");
  const password = form.get("password");

  if (typeof usernameOrEmail !== "string" || typeof password !== "string") {
    return json(
      {
        fields: null,
        fieldError: null,
        formError: "Form not submitted correctly.",
      },
      { status: 400 }
    );
  }

  let user, fieldError, formError;

  const fields = {
    usernameOrEmail,
    password,
  };

  const loginReaponse = await login({
    usernameOrEmail: usernameOrEmail,
    password: password,
  });

  if ("user" in loginReaponse) {
    user = loginReaponse.user;
    return createUserSession(user.id, "/");
  }

  if ("fieldError" in loginReaponse) {
    fieldError = loginReaponse.fieldError;
  } else {
    fieldError = null;
    formError = "Something's gone wrong";
  }

  return json(
    {
      fields: fields,
      fieldError: fieldError,
      formError: formError,
    },
    { status: 400 }
  );
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const fields = actionData?.fields;
  const fieldError = actionData?.fieldError;
  const formError = actionData?.formError;

  return (
    <div>
      <h1 className="text-2xl">Log In</h1>
      <LoginForm
        fields={fields}
        fieldError={fieldError}
        formError={formError}
      />
    </div>
  );
}
