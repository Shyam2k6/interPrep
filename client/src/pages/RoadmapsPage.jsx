import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getRoadmaps } from "../services/roadmapService";
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

        console.log(data);

        setRoadmaps(data.data.roadmaps);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRoadmaps();
  }, [token]);

  return (
    <div>
      <h1>My Roadmaps</h1>

      <RoadmapForm />

      {roadmaps.map((roadmap) => (
        <RoadmapCard key={roadmap._id} roadmap={roadmap} />
      ))}
    </div>
  );
}

export default RoadmapsPage;
