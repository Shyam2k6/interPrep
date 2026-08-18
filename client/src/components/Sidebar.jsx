import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/career", label: "Career Intelligence" },
  { to: "/skills", label: "My Skills" },
  { to: "/goals", label: "Goals" },
  { to: "/roadmaps", label: "Roadmaps" },
  { to: "/study-session", label: "Study Sessions" },
  { to: "/ai-coach", label: "AI Coach" },
  { to: "/ai-roadmap", label: "AI Roadmap" },
];

const Logo = () => (
  <div className="relative h-7 w-7 flex items-center justify-center mr-2">
    <svg
      className="absolute h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 3 22 21 2 21" stroke="#e2583e" strokeWidth="2.5" />
    </svg>
    <svg
      className="absolute h-6 w-6 transform translate-x-0.5 translate-y-0.5 scale-75"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 3 22 21 2 21" stroke="#ff7a59" strokeWidth="2" />
    </svg>
  </div>
);

function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="border-b border-[#eef0f2] bg-white px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8 flex flex-col justify-between shadow-sm">
      <div>
        {/* Brand Logo Header */}
        <div className="flex items-center px-2 py-1">
          <Logo />
          <span className="text-xl font-bold tracking-tight text-zinc-950">
            InterPrep
          </span>
        </div>

        {/* Navigation links */}
        <nav className="mt-8 space-y-1.5">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${isActive
                  ? "bg-[#e2583e] text-white font-bold shadow-md shadow-orange-500/10"
                  : "text-zinc-600 hover:bg-[#f8f9fa] hover:text-zinc-950"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout at bottom */}
      <div className="mt-8">
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 active:scale-95 cursor-pointer shadow-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
