import type { FetcherWithComponents } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useState } from "react";
import debounce from "~/services/debounce";

const validateEmailFormat = (email: string) => /\S+@\S+\.\S+/.test(email);

export interface FieldErrors {
  [key: string]: string | undefined;
}

export interface RegistrationFetcher {
  fieldErrors?: FieldErrors | null;
  formError?: string | null;
  usernameExists?: boolean | null;
  emailExists?: boolean | null;
}

interface RegistrationProps {
  fetcher: FetcherWithComponents<RegistrationFetcher>;
}

export default function RegistrationForm({ fetcher }: RegistrationProps) {
  const fetcherData = fetcher.data;
  // `emailFormValue` and `usernameFormValue` are set so that both `email` and `username`
  // can be passed to `checkEmailExists` and `checkUsernameExists`
  const [emailFormValue, setEmailFormValue] = useState("");
  const [usernameFormValue, setUsernameFormValue] = useState("");
  // allows `passwordValid` to be used to set the `submitDisabled` variable
  const [passwordValid, setPasswordValid] = useState(false);

  let emailExists = false,
    usernameExists = false,
    submitDisabled = true,
    fieldErrors: FieldErrors = {};

  if (fetcherData) {
    emailExists = fetcherData?.emailExists ?? false;
    usernameExists = fetcherData?.usernameExists ?? false;
    fieldErrors = fetcherData?.fieldErrors ?? {};
  }

  submitDisabled = Boolean(
    emailExists ||
      usernameExists ||
      !emailFormValue ||
      !usernameFormValue ||
      !passwordValid
  );

  const checkEmailExists = debounce(
    (email: string, username: string | null) => {
      if (validateEmailFormat(email)) {
        let currentUsername = username ? username : "";
        fetcher.load(
          `/api/usernameOrEmailExists?email=${encodeURIComponent(
            email
          )}&username=${encodeURIComponent(currentUsername)}`
        );
      }
    },
    500
  );

  const checkUsernameExists = debounce(
    (username: string, email: string | null) => {
      if (username.length > 2) {
        const currentEmail = email ? email : "";
        fetcher.load(
          `/api/usernameOrEmailExists?username=${encodeURIComponent(
            username
          )}&email=${encodeURIComponent(currentEmail)}`
        );
      }
    },
    500
  );

  // Get the input's value, then call the handleInput function
  // avoids issues with React's event pooling. Look into that more
  // before using in production.
  const emailInputHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const email = event.currentTarget.value;
    setEmailFormValue(email);
    checkEmailExists(email, usernameFormValue);
    // remove the `emailExists` warning when new text is entered
    if (email && emailExists) {
      emailExists = false;
    }
  };

  const usernameInputHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const username = event.currentTarget.value;
    setUsernameFormValue(username);
    checkUsernameExists(username, emailFormValue);
    // remove the `usernameExists` warning when new text is entered
    if (username && usernameExists) {
      usernameExists = false;
    }
  };

  const passwordInputHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const password = event.currentTarget.value;
    setPasswordValid(password.length >= 8);
  };

  return (
    <div>
      <fetcher.Form
        className="flex flex-col max-w-60 border border-slate-400 p-3"
        method="post"
        action="/login?action=new_account"
      >
        <label htmlFor="email">Email</label>
        <input
          className="border border-slate-600 px-1"
          type="email"
          id="email"
          name="email"
          onInput={emailInputHandler}
          minLength={5}
          maxLength={320}
          aria-invalid={Boolean(fieldErrors?.email)}
          aria-errormessage={fieldErrors?.email ? fieldErrors.email : ""}
        />
        <div className="min-h-6">
          {emailExists && (
            <p className="text-sm text-red-600">
              Email address taken. Maybe you already have an account?
            </p>
          )}
          {fieldErrors?.email && (
            <p className="text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>
        <label htmlFor="username">Username</label>
        <input
          className="border border-slate-600 px-1"
          type="text"
          id="username"
          name="username"
          onInput={usernameInputHandler}
          minLength={3}
          maxLength={60}
          aria-invalid={Boolean(fieldErrors?.username)}
          aria-errormessage={fieldErrors?.username ? fieldErrors.username : ""}
        />
        <div className="min-h-6">
          {usernameExists && (
            <p className="text-sm text-red-600">Username taken.</p>
          )}
          {fieldErrors?.username && (
            <p className="text-sm text-red-600">{fieldErrors.username}</p>
          )}
        </div>

        <label htmlFor="password">
          Password <span className="text-sm">(min 8 characters)</span>
        </label>
        {/* note that 2FA is available but not enforced on the site */}
        <input
          className="border border-slate-600 px-1"
          type="password"
          id="password"
          name="password"
          onInput={passwordInputHandler}
          minLength={8}
          maxLength={255}
          aria-invalid={Boolean(fieldErrors?.password)}
          aria-errormessage={fieldErrors?.password ? fieldErrors.password : ""}
        />
        <div className="min-h-3">
          {fieldErrors?.password && (
            <p className="text-sm text-red-600">{fieldErrors.password}</p>
          )}
        </div>
        <div className="mt-4">
          <button
            disabled={submitDisabled}
            className={`border border-sky-900 text-slate-50 px-2 py-1 rounded-sm ${
              submitDisabled
                ? "bg-slate-500 cursor-default"
                : "bg-sky-800 cursor-pointer"
            }`}
            type="submit"
          >
            Register
          </button>
        </div>
      </fetcher.Form>
      <Link className="text-sm text-sky-700 hover:underline" to="/login">
        Log in
      </Link>
    </div>
  );
}
