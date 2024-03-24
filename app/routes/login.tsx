import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  useFetcher,
  FetcherWithComponents,
  useLoaderData,
} from "@remix-run/react";

import LoginForm from "~/components/LoginForm";
import RegistrationForm from "~/components/RegistrationForm";
import { createUserSession, login } from "~/services/session.server";
import { registerUser } from "~/services/user";
import type { LoginFetcher } from "~/components/LoginForm";
import type { RegistrationFetcher } from "~/components/RegistrationForm";

type LoginRegistrationFetcher = LoginFetcher | RegistrationFetcher;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const formType = action === "new_account" ? "register" : "login";
  const initiateLoginFor = url.searchParams.get("username");
  return json({ formType: formType, username: initiateLoginFor });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");
  const formType = action === "new_account" ? "register" : "login";
  const form = await request.formData();

  switch (formType) {
    case "login":
      const usernameOrEmail = form.get("usernameOrEmail");
      const password = form.get("password");

      if (typeof usernameOrEmail !== "string" || typeof password !== "string") {
        return json(
          {
            fieldError: null,
            formError: "Form not submitted correctly.",
          },
          { status: 400 }
        );
      }

      let user, fieldError, formError;

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
          fieldError: fieldError,
          formError: formError,
        },
        { status: 400 }
      );

    case "register":
      const email = form.get("email");
      const username = form.get("username");
      const registrationPassword = form.get("password");
      if (
        typeof email !== "string" ||
        typeof username !== "string" ||
        typeof registrationPassword !== "string"
      ) {
        return json(
          {
            fieldError: null,
            formError: "Form not submitted correctly",
          },
          { status: 400 }
        );
      }

      const registrationResponse = await registerUser({
        email: email,
        username: username,
        password: registrationPassword,
      });

      if ("user" in registrationResponse) {
        return redirect(
          `/login?username=${registrationResponse.user.username}`
        );
      }

      return json({
        formError: "Something has gone wrong",
      });
  }
};

export default function Login() {
  const { formType, username } = useLoaderData<typeof loader>();
  const fetcher: FetcherWithComponents<LoginRegistrationFetcher> = useFetcher();
  return (
    <div>
      {formType === "login" && (
        <div>
          <h1 className="text-2xl">Log In</h1>
          <LoginForm fetcher={fetcher} username={username} />
        </div>
      )}
      {formType === "register" && (
        <div>
          <h1 className="text-2xl">Register</h1>
          <RegistrationForm fetcher={fetcher} />
        </div>
      )}
    </div>
  );
}
