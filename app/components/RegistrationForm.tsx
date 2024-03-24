import type { FetcherWithComponents } from "@remix-run/react";

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
          aria-invalid={false} // todo: set this conditionally
          aria-errormessage="don't forget about this"
        />

        <label htmlFor="email">Username</label>
        <input
          className="border border-slate-600 px-1"
          type="text"
          id="username"
          name="username"
          aria-invalid={false} // todo: set this conditionally
          aria-errormessage="don't forget about this"
        />
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
          <button className="border border-slate-600 w-16" type="submit">
            Login
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}
