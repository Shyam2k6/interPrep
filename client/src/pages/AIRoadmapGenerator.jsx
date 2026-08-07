import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { generateRoadmap } from "../services/aiService";
import { createRoadmap } from "../services/roadmapService";
import { getGoals } from "../services/goalService";

function AIRoadmapGenerator() {
  const { token } = useAuth();

  const [goal, setGoal] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState([]);
  const [selectedGoalId, setSelectedGoalId] = useState("");

  useEffect(() => {
    if (!token) return;
    const fetchGoals = async () => {
      try {
        const res = await getGoals(token);
        setGoals(res.data.goal || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGoals();
  }, [token]);

  const handleGoalSelect = (e) => {
    const val = e.target.value;
    setSelectedGoalId(val);
    if (val) {
      const selected = goals.find((g) => g._id === val);
      if (selected) {
        setGoal(`Study plan for: ${selected.title}`);
      }
    } else {
      setGoal("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    try {
      setLoading(true);
      const data = await generateRoadmap(goal, token);
      setRoadmap(data.roadmap);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoadmap = async () => {
    try {
      await createRoadmap(
        {
          title: roadmap.title,
          steps: roadmap.steps,
          goal: selectedGoalId || null,
        },
        token,
      );

      alert("Roadmap saved successfully!");

      setGoal("");
      setRoadmap(null);
      setSelectedGoalId("");
    } catch (error) {
      console.log(error);
      alert("Failed to save roadmap");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="rounded-3xl bg-[#e2583e] p-6 shadow-lg shadow-orange-500/10 text-white border-none">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/85">
          AI tools
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
          ✨ AI Roadmap Generator
        </h1>
        <p className="mt-2 text-sm text-white/90">
          Generate structured learning milestones powered by AI for any topic, or link it to a specific workspace goal.
        </p>
      </header>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Step 1: Link to Workspace Goal (Optional)
              </label>
              <select
                value={selectedGoalId}
                onChange={handleGoalSelect}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 cursor-pointer"
              >
                <option value="">Create a custom roadmap (No goal link)</option>
                {goals.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.title} ({g.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Step 2: Define Roadmap Topic or Query
              </label>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Become a MERN Stack Developer, Master React Hooks, etc."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !goal.trim()}
            className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Generating milestones..." : "Generate AI Roadmap"}
          </button>
        </form>

        {roadmap && (
          <div className="mt-8 border-t border-slate-100 pt-6 animate-fadeIn">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{roadmap.title}</h2>
                {selectedGoalId && (
                  <span className="mt-1 inline-block rounded-full bg-indigo-50 border border-indigo-150 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                    🔗 Will link to goal
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {roadmap.steps.map((step, index) => (
                <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 text-sm text-slate-700 font-medium">
                  {index + 1}. {step.title}
                </div>
              ))}
            </div>

            <button
              onClick={handleSaveRoadmap}
              className="mt-6 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition cursor-pointer active:scale-95"
            >
              Save Roadmap to Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIRoadmapGenerator;
