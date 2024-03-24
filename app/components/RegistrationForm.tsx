import type { FetcherWithComponents } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useState } from "react";
import debounce from "~/services/debounce";

const validateEmailFormat = (email: string) => /\S+@\S+\.\S+/.test(email);

export interface FieldError {
  key: string;
  message: string;
}

export interface RegistrationFetcher {
  fieldError?: FieldError | null;
  formError?: string | null;
  usernameExists?: boolean | null;
  emailExists?: boolean | null;
}

interface RegistraionProps {
  fetcher: FetcherWithComponents<RegistrationFetcher>;
}

export default function RegistrationForm({ fetcher }: RegistraionProps) {
  const fetcherData = fetcher.data;
  const [emailValue, setEmailValue] = useState("");
  const [usernameValue, setUsernameValue] = useState("");
  let emailExists = false,
    usernameExists = false,
    submitDisabled = false;
  if (fetcherData && fetcherData?.emailExists) {
    emailExists = fetcherData.emailExists;
  }
  if (fetcherData && fetcherData?.usernameExists) {
    usernameExists = fetcherData.usernameExists;
  }
  submitDisabled = Boolean(emailExists || usernameExists);

  const handleEmailInput = debounce(
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

  // Get the input's value, then call the debounced handleInput function
  // avoids issues with React's event pooling. Look into that more
  // before using in production.
  const debouncedEmailInputHandler = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    // Extract the value right away, so it's not accessed asynchronously
    const email = event.currentTarget.value;
    setEmailValue(email);
    handleEmailInput(email, usernameValue);
    if (email && emailExists) {
      emailExists = false;
    }
  };

  const handleUsernameInput = debounce(
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

  const debouncedUsernameInputHandler = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const username = event.currentTarget.value;
    setUsernameValue(username);
    handleUsernameInput(username, emailValue);
    if (username && usernameExists) {
      usernameExists = false;
    }
  };

  return (
    <div>
      <fetcher.Form
        className="flex flex-col max-w-80 border border-slate-400 p-3"
        method="post"
        action="/login?action=new_account"
      >
        <label htmlFor="email">Email</label>
        <input
          className="border border-slate-600 px-1"
          type="email"
          id="email"
          name="email"
          onInput={debouncedEmailInputHandler}
          aria-invalid={false} // todo: set this conditionally
          aria-errormessage="don't forget about this"
        />
        {emailExists && (
          <p className="text-sm text-red-600">
            Email address taken. Try logging into your account?
          </p>
        )}

        <label htmlFor="username">Username</label>
        <input
          className="border border-slate-600 px-1"
          type="text"
          id="username"
          name="username"
          onInput={debouncedUsernameInputHandler}
          aria-invalid={false} // todo: set this conditionally
          aria-errormessage="don't forget about this"
        />
        {usernameExists && (
          <p className="text-sm text-red-600">Username taken.</p>
        )}

        <label htmlFor="password">Password</label>
        <input
          className="border border-slate-600 px-1"
          type="password"
          id="password"
          name="password"
          aria-invalid={false} // todo: set this conditionally
          aria-errormessage="don't forget about this"
        />
        <div className="mt-4">
          <button
            disabled={submitDisabled}
            className={`border border-slate-600 w-16 ${
              submitDisabled && "bg-slate-300"
            }`}
            type="submit"
          >
            Login
          </button>
        </div>
      </fetcher.Form>
      <Link className="text-sm text-sky-700 hover:underline" to="/login">
        Login
      </Link>
    </div>
  );
}
