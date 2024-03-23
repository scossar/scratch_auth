import type { FetcherWithComponents } from "@remix-run/react";

export interface FieldError {
  key: string;
  message: string;
}

export interface LoginFetcher {
  fieldError?: FieldError | null;
  formError?: string | null;
}

interface LoginProps {
  fetcher: FetcherWithComponents<LoginFetcher>;
}

export default function LoginForm({ fetcher }: LoginProps) {
  const fetcherData = fetcher.data;
  let emailOrUsernameError = false,
    emailOrUsernameErrorMessage,
    passwordError = false,
    passwordErrorMessage,
    formError;
  if (fetcherData) {
    emailOrUsernameError =
      fetcherData?.fieldError?.key === "usernameOrEmail" ? true : false;
    emailOrUsernameErrorMessage = emailOrUsernameError
      ? fetcherData?.fieldError?.message
      : null;
    passwordError = fetcherData?.fieldError?.key === "password" ? true : false;
    passwordErrorMessage = passwordError
      ? fetcherData?.fieldError?.message
      : null;
    formError = fetcherData?.formError;
  }

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    fetcher.submit(
      { usernameOrEmail: value, password: "password_needed" },
      { action: "/login", method: "post" }
    );
  };

  return (
    <div>
      <fetcher.Form
        className="flex flex-col max-w-80 border border-slate-400 p-3"
        method="post"
        action="/login"
      >
        <label htmlFor="username-or-email">Username or Email</label>
        <input
          className="border border-slate-600 px-1"
          type="text"
          id="username-or-email"
          name="usernameOrEmail"
          onInput={handleInput}
          aria-invalid={emailOrUsernameError}
          aria-errormessage={
            emailOrUsernameErrorMessage ? emailOrUsernameErrorMessage : ""
          }
        />
        {emailOrUsernameErrorMessage && (
          <p className="text-sm text-red-600">{emailOrUsernameErrorMessage}</p>
        )}
        <label htmlFor="password">Password</label>
        <input
          className="border border-slate-600 px-1"
          type="password"
          id="password"
          name="password"
          aria-invalid={passwordError}
          aria-errormessage={passwordErrorMessage ? passwordErrorMessage : ""}
        />
        {passwordErrorMessage && (
          <p className="text-sm text-red-600">{passwordErrorMessage}</p>
        )}
        {formError && (
          <div className="border border-red-500 p-2 my-2 rounded-sm text-sm">
            {formError}
          </div>
        )}

        <div className="mt-4">
          <button className="border border-slate-600 w-16" type="submit">
            Login
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}
