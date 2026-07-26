import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { generateRoadmap } from "../services/aiService";

function AIRoadmapGenerator() {
  const { token } = useAuth();

  const [goal, setGoal] = useState("");
  const [roadmap, setRoadmap] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await generateRoadmap(goal, token);

    setRoadmap(data.roadmap);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">✨ AI Roadmap Generator</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Become a MERN Stack Developer"
          className="w-full rounded-xl border p-3"
        />

        <button className="mt-3 rounded-xl bg-slate-900 px-5 py-3 text-white">
          Generate
        </button>
      </form>

      {roadmap && (
        <div className="rounded-xl border p-5">
          <h2 className="text-xl font-semibold">{roadmap.title}</h2>

          <div className="mt-4 space-y-3">
            {roadmap.steps.map((step, index) => (
              <div key={index} className="rounded-lg border p-3">
                {index + 1}. {step.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AIRoadmapGenerator;
