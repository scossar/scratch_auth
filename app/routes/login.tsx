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
import type {
  FieldErrors,
  RegistrationFetcher,
} from "~/components/RegistrationForm";

type LoginRegistrationFetcher = LoginFetcher | RegistrationFetcher;

const validateUsername = (username: string) => {
  const valid = username.length >= 3;
  const message = valid
    ? ""
    : "Usernames must be at least three characters long.";
  return { valid: valid, message: message };
};

const validateEmail = (email: string) => {
  const valid = /\S+@\S+\.\S+/.test(email);
  const message = valid ? "" : `${email} is not a valid email address.`;
  return { valid: valid, message: message };
};

const validatePassword = (password: string) => {
  // todo: validate max length too
  const valid = password.length >= 8;
  const message = valid ? "" : "Passwords must be at least 8 characters long.";
  return { valid: valid, message: message };
};

// Used to conditionally render either Login or Registration form
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
  const formType = action === "new_account" ? "register" : "login"; // Determines which form to process
  const form = await request.formData();
  const usernameOrEmail = form.get("usernameOrEmail"); // Login form param
  const password = form.get("password"); // Login and Registration form param
  const email = form.get("email"); // Registration form param
  const username = form.get("username"); // Registration form param

  switch (formType) {
    case "login":
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
      let fieldErrors: FieldErrors = {};
      if (
        typeof email !== "string" ||
        typeof username !== "string" ||
        typeof password !== "string"
      ) {
        return json(
          {
            formError: "Form not submitted correctly",
          },
          { status: 400 }
        );
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        fieldErrors["email"] = emailValidation.message;
      }
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.valid) {
        fieldErrors["username"] = usernameValidation.message;
      }
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        fieldErrors["password"] = passwordValidation.message;
      }

      if (Object.keys(fieldErrors).length > 0) {
        return json(
          {
            fieldErrors: fieldErrors,
          },
          {
            status: 400,
          }
        );
      }

      const registrationResponse = await registerUser({
        email: email,
        username: username,
        password: password,
      });

      if ("user" in registrationResponse) {
        return redirect(
          `/login?username=${registrationResponse.user.username}`
        );
      }

      // if this gets executed, something really has gone wrong
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
