import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <h1 className="text-2xl">Remix Auth Test</h1>
      <div className="my-6">
        <Link
          className="px-3 py-2 border-slate-600 border-2 hover:bg-slate-100"
          to="/login"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
