import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-[#fafafa] px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          InterPrep
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Plan your learning like a professional product team.
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          Track goals, structure roadmaps, and keep momentum without friction.
          The experience is designed to feel calm, polished, and focused.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/register"
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-slate-900">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default HomePage;
