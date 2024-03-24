import type { FetcherWithComponents } from "@remix-run/react";
import debounce from "~/services/debounce";

export interface FieldError {
  key: string;
  message: string;
}

export interface LoginFetcher {
  fieldError?: FieldError | null;
  formError?: string | null;
  usernameOrEmailExists?: boolean | null;
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
    formError,
    usernameOrEmailNotFound;

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
    usernameOrEmailNotFound = !fetcherData?.usernameOrEmailExists;
  }

  const handleInput = debounce((value: string) => {
    fetcher.load(
      `/api/usernameOrEmailExists?usernameOrEmail=${encodeURIComponent(value)}`
    );
  }, 500);

  // Get the input's value, then call the debounced handleInput function
  // avoids issues with React's event pooling. Look into that more
  // before using in production.
  const debouncedInputHandler = (event: React.FormEvent<HTMLInputElement>) => {
    // Extract the value right away, so it's not accessed asynchronously
    const usernameOrEmail = event.currentTarget.value;
    handleInput(usernameOrEmail);
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
          onInput={debouncedInputHandler}
          aria-invalid={emailOrUsernameError}
          aria-errormessage={
            emailOrUsernameErrorMessage ? emailOrUsernameErrorMessage : ""
          }
        />
        {emailOrUsernameErrorMessage ||
          (usernameOrEmailNotFound === true && (
            <p className="text-sm text-red-600">
              {emailOrUsernameErrorMessage || "User not found."}
            </p>
          ))}
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
