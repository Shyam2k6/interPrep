import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);
      login(data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 py-16 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm"
      >
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Sign in to continue
        </h1>

        <div className="mt-6 space-y-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900"
          />
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Log in
        </button>

        <p className="mt-4 text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-slate-900">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
