import { Form } from "@remix-run/react";

interface Fields {
  usernameOrEmail?: string;
  password?: string;
}

type FieldErrors = Record<keyof Fields, string | undefined>;

interface FormError {
  formError?: string;
}

interface LoginProps {
  fields?: Fields;
  fieldErrors?: FieldErrors;
  formError?: FormError;
}

export default function LoginForm({
  fields,
  fieldErrors,
  formError,
}: LoginProps) {
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
          aria-invalid={Boolean(fieldErrors?.usernameOrEmail)}
          aria-errormessage={
            fieldErrors?.usernameOrEmail ? "Username or Email error" : ""
          }
        />
        {fieldErrors?.usernameOrEmail && (
          <p className="text-sm text-red-600">{fieldErrors.usernameOrEmail}</p>
        )}
        <label htmlFor="password">Password</label>
        <input
          className="border border-slate-600 px-1"
          type="password"
          id="password"
          name="password"
          defaultValue={fields?.password}
          aria-invalid={Boolean(fieldErrors?.password)}
          aria-errormessage={fieldErrors?.password ? "Password error" : ""}
        />
        {fieldErrors?.password && (
          <p className="text-sm text-red-600">{fieldErrors.password}</p>
        )}
        {formError?.formError && (
          <div className="border border-red-500 p-2 my-2 rounded-sm text-sm">
            {formError.formError} // warning 'FormError is not assignable to
            type ReactNode'
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
