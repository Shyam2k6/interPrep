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
    <div>
      <h1>My Roadmaps</h1>

      <RoadmapForm onAddRoadmap={handleAddRoadmap} />

      {roadmaps.map((roadmap) => (
        <RoadmapCard
          key={roadmap._id}
          roadmap={roadmap}
          onToggleStep={handleToggleStep}
          onDelete={handleDeleteRoadmap}
        />
      ))}
    </div>
  );
}

export default RoadmapsPage;
