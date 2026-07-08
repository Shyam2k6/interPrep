import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/goals", label: "Goals" },
  { to: "/roadmaps", label: "Roadmaps" },
];

function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-medium text-slate-900">
              {user?.name || "Explorer"}
            </p>
          </div>
        </div>
      </div>

      <nav className="mt-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={logout}
        className="mt-8 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
