import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <Link to="/" className="text-base font-semibold text-slate-900">
        InterPrep
      </Link>
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <Link to="/login" className="transition hover:text-slate-900">
          Login
        </Link>
        <Link
          to="/register"
          className="rounded-full bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
        >
          Create account
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
