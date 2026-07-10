import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getRoadmaps,
  createRoadmap,
  toggleStep,
  deleteRoadmap,
} from "../services/roadmapService";
import RoadmapCard from "../components/RoadmapCard";
import RoadmapForm from "../components/RoadmapForm";

function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchRoadmaps = async () => {
      try {
        const data = await getRoadmaps(token);
        setRoadmaps(data.data.roadmaps);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoadmaps();
  }, [token]);

  const handleAddRoadmap = async (roadmapData) => {
    try {
      const data = await createRoadmap(roadmapData, token);
      setRoadmaps((prev) => [...prev, data.data.roadmap]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleStep = async (roadmapId, stepId) => {
    try {
      const data = await toggleStep(roadmapId, stepId, token);
      setRoadmaps((prev) =>
        prev.map((roadmap) =>
          roadmap._id === roadmapId ? data.data.roadmap : roadmap,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRoadmap = async (roadmapId) => {
    try {
      await deleteRoadmap(roadmapId, token);
      setRoadmaps((prev) =>
        prev.filter((roadmap) => roadmap._id !== roadmapId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Roadmaps
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Build a path, one milestone at a time.
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Break larger ambitions into clear, manageable steps.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <RoadmapForm onAddRoadmap={handleAddRoadmap} />
        </section>

        <section className="space-y-4">
          {roadmaps.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              No roadmaps yet. Create your first structured plan.
            </div>
          ) : (
            roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap._id}
                roadmap={roadmap}
                onToggleStep={handleToggleStep}
                onDelete={handleDeleteRoadmap}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default RoadmapsPage;
