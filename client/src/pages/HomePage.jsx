import { Link } from "react-router-dom";

const DashboardMockup = () => {
  return (
    <div className="w-full rounded-2xl border border-[#eef0f2] bg-white shadow-2xl overflow-hidden font-sans text-left transition duration-500 hover:shadow-zinc-300/40">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#eef0f2] bg-[#f8f9fa]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
        </div>
        <span className="text-xs text-zinc-400 font-mono">interprep-dashboard.app</span>
        <div className="w-12"></div>
      </div>

      {/* Window Body Layout */}
      <div className="flex h-[320px]">
        {/* Mock Sidebar */}
        <div className="w-32 border-r border-[#eef0f2] bg-[#f8f9fa]/50 p-2 space-y-1.5 hidden sm:block">
          <div className="h-4 w-12 bg-zinc-200 rounded mb-4 ml-1 opacity-60"></div>
          <div className="flex items-center gap-2 px-2 py-1 bg-[#e2583e]/10 rounded-lg text-[#e2583e] text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2583e] animate-pulse"></span>
            Goals
          </div>
          <div className="px-2 py-1 text-zinc-500 text-xs font-semibold hover:text-zinc-900 transition">Roadmaps</div>
          <div className="px-2 py-1 text-zinc-500 text-xs font-semibold hover:text-zinc-900 transition">Study Logs</div>
          <div className="px-2 py-1 text-zinc-500 text-xs font-semibold hover:text-zinc-900 transition">AI Coach</div>
        </div>

        {/* Mock Main Content Area */}
        <div className="flex-1 p-4 space-y-4 overflow-hidden bg-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-2 w-16 bg-zinc-200 rounded opacity-60"></div>
              <div className="h-4 w-28 bg-zinc-900 rounded mt-1.5"></div>
            </div>
            <div className="h-5 w-16 bg-[#e2583e]/10 border border-[#e2583e]/20 text-[#e2583e] text-[10px] font-bold rounded-full flex items-center justify-center">
              🔥 5 Days
            </div>
          </div>

          {/* Goal Card Mockup */}
          <div className="p-3 rounded-xl border border-[#eef0f2] bg-[#f8f9fa]/50 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#e2583e] tracking-wider">System Design Prep</span>
                <p className="text-xs font-bold text-zinc-900 mt-0.5">Scale Microservices Architecture</p>
              </div>
              <span className="text-[10px] text-zinc-500">80% Done</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
              <div className="h-full w-[80%] bg-[#e2583e] rounded-full"></div>
            </div>
          </div>

          {/* Mini AI Coach Bubble Mockup */}
          <div className="p-3 rounded-xl border border-[#e2583e]/10 bg-[#e2583e]/5 text-[#e2583e] flex gap-2">
            <span className="text-xs">🤖</span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider">AI Coach feedback</p>
              <p className="text-[11px] text-zinc-700 mt-0.5 leading-relaxed">
                Great consistency! You've finished 4 system design goals. Focus on Database Sharding next.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function HomePage() {
  return (
    <div className="min-h-screen bg-[#f4f5f6] bg-grid relative text-zinc-700">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-radial-fade pointer-events-none z-0"></div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="w-full grid gap-16 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">

          {/* Left Text Box */}
          <div className="space-y-8 text-left">
            <div>
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#eef0f2] bg-white px-3.5 py-1.5 text-xs text-zinc-500 mb-6 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-[#e2583e] animate-pulse"></span>
                <span>InterPrep Workspace v1.0</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl leading-[1.1] font-sans">
                Become the best developer you can be. <span className="text-[#e2583e]">Outsmart AI.</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-zinc-600 max-w-lg">
                Hi, we help you prepare! InterPrep structures your study habits, tracks priority goals, and designs customized learning roadmaps with active AI study coaching. Build habits that last.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="rounded-full bg-zinc-950 hover:bg-[#e2583e] px-7 py-4 text-sm font-bold text-white transition active:scale-95 shadow-lg shadow-zinc-950/10 cursor-pointer"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-full border border-slate-200 bg-white hover:bg-zinc-50 px-7 py-4 text-sm font-bold text-zinc-700 transition active:scale-95 cursor-pointer shadow-sm"
              >
                Sign in to workspace
              </Link>
            </div>

            {/* Stars Review Stats */}
            {/* <div className="pt-6 border-t border-[#eef0f2] flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex -space-x-2">
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-zinc-800 text-center text-[10px] leading-8 text-white font-bold">JS</span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#e2583e] text-center text-[10px] leading-8 text-white font-bold">JD</span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-zinc-600 text-center text-[10px] leading-8 text-white font-bold">AL</span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-zinc-900 text-center text-[10px] leading-8 text-white font-bold">★</span>
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-950">Loved by 50,000+ developers</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#e2583e] text-sm">★★★★★</span>
                  <span className="text-xs text-zinc-500">Rated 4.9/5 from 12,000+ workspace reviews</span>
                </div>
              </div>
            </div> */}
          </div>

          {/* Right Product Mockup Box */}
          <div className="relative flex items-center justify-center">
            {/* Ambient Background Gradient behind Mockup */}
            <div className="absolute w-[80%] aspect-square bg-[#e2583e]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
            <div className="relative z-10 w-full">
              <DashboardMockup />
            </div>
          </div>

        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full mt-32 pt-16 border-t border-[#eef0f2]">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <h2 className="text-3xl font-extrabold text-zinc-950 tracking-tight sm:text-4xl">
              Engineered for structure. Made for action.
            </h2>
            <p className="text-base text-zinc-500 leading-relaxed">
              Ditch the scattered notes. InterPrep aggregates all your learning roadmap structures, daily study hours, and targets in a unified, professional environment.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-[#eef0f2] bg-white p-6 space-y-4 text-left shadow-sm transition duration-300 hover:shadow-md hover:border-[#e2583e]/20">
              <div className="h-10 w-10 rounded-xl bg-[#e2583e]/10 border border-[#e2583e]/20 flex items-center justify-center text-[#e2583e] text-lg">
                🎯
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Targeted Goal Tracking</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Define milestones, drag progress check-ins, and keep your daily technical training goals visible on a high-focus kanban dashboard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-[#eef0f2] bg-white p-6 space-y-4 text-left shadow-sm transition duration-300 hover:shadow-md hover:border-[#e2583e]/20">
              <div className="h-10 w-10 rounded-xl bg-[#e2583e]/10 border border-[#e2583e]/20 flex items-center justify-center text-[#e2583e] text-lg">
                🔥
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Commit-style Heatmaps</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Log daily study sessions, track active streaks, and watch your progress visually grow in a GitHub-inspired contribution consistency grid.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-[#eef0f2] bg-white p-6 space-y-4 text-left shadow-sm transition duration-300 hover:shadow-md hover:border-[#e2583e]/20">
              <div className="h-10 w-10 rounded-xl bg-[#e2583e]/10 border border-[#e2583e]/20 flex items-center justify-center text-[#e2583e] text-lg">
                🤖
              </div>
              <h3 className="text-lg font-bold text-zinc-950">Interactive AI Coach</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Stuck on a roadmap topic? Ask the AI Coach. Generate visual roadmaps on the fly and get personalized feedback for database, system scale, or DSA prep.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default HomePage;
