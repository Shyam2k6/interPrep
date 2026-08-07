import { Link } from "react-router-dom";

const Logo = () => (
  <div className="relative h-7 w-7 flex items-center justify-center mr-2">
    <svg className="absolute h-6 w-6" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 3 22 21 2 21" stroke="#e2583e" strokeWidth="2.5" />
    </svg>
    <svg className="absolute h-6 w-6 transform translate-x-0.5 translate-y-0.5 scale-75" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 3 22 21 2 21" stroke="#ff7a59" strokeWidth="2" />
    </svg>
  </div>
);

function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-[#eef0f2] bg-white/90 px-4 py-4 backdrop-blur-md sticky top-0 z-50 sm:px-6 lg:px-8 shadow-sm shadow-zinc-100/50">
      <Link to="/" className="flex items-center text-lg font-bold tracking-tight text-zinc-950">
        <Logo />
        <span>InterPrep</span>
      </Link>
      <div className="flex items-center gap-4 text-sm font-semibold">
        <Link to="/login" className="text-zinc-600 transition hover:text-zinc-950">
          Login
        </Link>
        <Link
          to="/register"
          className="rounded-full bg-zinc-950 hover:bg-[#e2583e] px-4 py-2 text-white font-semibold tracking-tight transition active:scale-95 shadow-sm"
        >
          Create account
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
