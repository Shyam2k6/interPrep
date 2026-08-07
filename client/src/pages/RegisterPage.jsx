import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

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

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await registerUser(formData);
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data);
      setErrorMsg(error.response?.data?.message || "Failed to create account. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[#f4f5f6] px-4 py-16 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[28px] border border-[#eef0f2] bg-white p-8 shadow-xl relative overflow-hidden"
      >
        <div className="flex items-center justify-center mb-6">
          <Logo />
          <span className="text-xl font-bold tracking-tight text-zinc-950">InterPrep</span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#e2583e] text-center">
          Start fresh
        </p>
        <h1 className="mt-2 text-2xl font-bold text-zinc-950 text-center tracking-tight">
          Create your account
        </h1>

        {errorMsg && (
          <div className="mt-4 rounded-xl bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 text-center">
            {errorMsg}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 ml-1">Your Name</label>
            <input
              type="text"
              name="name"
              placeholder="Jonas Schmedtmann"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#e2583e] focus:ring-2 focus:ring-[#e2583e]/10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#e2583e] focus:ring-2 focus:ring-[#e2583e]/10"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-500 ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-[#e2583e] focus:ring-2 focus:ring-[#e2583e]/10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-zinc-950 hover:bg-[#e2583e] px-4 py-3 text-sm font-bold text-white transition active:scale-95 shadow-lg shadow-zinc-950/10 disabled:opacity-55 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-6 text-sm text-zinc-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#e2583e] hover:text-[#c8452d] transition">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
