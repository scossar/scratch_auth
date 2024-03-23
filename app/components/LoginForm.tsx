import { Form } from "@remix-run/react";

interface Fields {
  usernameOrEmail?: string;
  password?: string;
}

export interface FieldError {
  key: string;
  message: string;
}

interface LoginProps {
  fields?: Fields | null;
  fieldError?: FieldError | null;
  formError?: string | null;
}

export default function LoginForm({
  fields,
  fieldError,
  formError,
}: LoginProps) {
  const emailErrorMessage =
    fieldError?.key === "usernameOrEmail" ? fieldError?.message : undefined;
  const passwordErrorMessage =
    fieldError?.key === "password" ? fieldError?.message : undefined;

  return (
    <div>
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
          defaultValue={fields?.usernameOrEmail}
          aria-invalid={Boolean(emailErrorMessage)}
          aria-errormessage={emailErrorMessage}
        />
        {emailErrorMessage && (
          <p className="text-sm text-red-600">{emailErrorMessage}</p>
        )}
        <label htmlFor="password">Password</label>
        <input
          className="border border-slate-600 px-1"
          type="password"
          id="password"
          name="password"
          defaultValue={fields?.password}
          aria-invalid={Boolean(passwordErrorMessage)}
          aria-errormessage={passwordErrorMessage ? passwordErrorMessage : ""}
        />
        {passwordErrorMessage && (
          <p className="text-sm text-red-600">{passwordErrorMessage}</p>
        )}
        {formError && (
          <div className="border border-red-500 p-2 my-2 rounded-sm text-sm">
            {formError} // warning 'FormError is not assignable to type
            ReactNode'
          </div>
        )}

        <div className="mt-4">
          <button className="border border-slate-600 w-16" type="submit">
            Login
          </button>
        </div>
      </Form>
    </div>
  );
}
