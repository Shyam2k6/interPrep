import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getRoadmaps } from "../services/roadmapService";

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

      {roadmaps.map((roadmap) => (
        <div key={roadmap._id}>
          <h2>{roadmap.title}</h2>

          <p>Progress: {roadmap.progress}%</p>
        </div>
      ))}
    </div>
  );
}

export default RoadmapsPage;
