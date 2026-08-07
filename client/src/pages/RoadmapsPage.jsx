import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  getRoadmaps,
  createRoadmap,
  toggleStep,
  deleteRoadmap,
} from "../services/roadmapService";
import { getGoals } from "../services/goalService";
import RoadmapCard from "../components/RoadmapCard";
import RoadmapForm from "../components/RoadmapForm";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";

function RoadmapsPage() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchRoadmaps = async () => {
      try {
        setLoading(true);
        const data = await getRoadmaps(token);
        setRoadmaps(data.data.roadmaps || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchGoals = async () => {
      try {
        const data = await getGoals(token);
        setGoals(data.data.goal || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGoals();
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

  const handleRoadmapUpdate = (updatedRoadmap) => {
    setRoadmaps((prev) =>
      prev.map((r) => (r._id === updatedRoadmap._id ? updatedRoadmap : r)),
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="rounded-3xl bg-[#e2583e] p-6 shadow-lg shadow-orange-500/10 text-white border-none">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/85">
          Roadmaps
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
          Build a path, one milestone at a time.
        </h1>
        <p className="mt-2 text-sm text-white/90">
          Break larger ambitions into clear, manageable steps.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <RoadmapForm onAddRoadmap={handleAddRoadmap} goals={goals} />
        </section>

        <section className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : roadmaps.length === 0 ? (
            <EmptyState
              title="No roadmaps created"
              description="Break your high-level plans into structured milestones by creating a roadmap on the left panel, or trigger the AI generator."
              icon="roadmaps"
            />
          ) : (
            roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap._id}
                roadmap={roadmap}
                onToggleStep={handleToggleStep}
                onDelete={handleDeleteRoadmap}
                onRoadmapUpdate={handleRoadmapUpdate}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}

export default RoadmapsPage;
