import { useEffect, useState } from "react";
import { getGoals } from "../services/goalService";
import { useAuth } from "../hooks/useAuth";
import GoalCard from "../components/GoalCard";

function GoalsPage() {
  const [goals, setGoals] = useState([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals(token);

        setGoals(data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div>
      <h1>My Goals</h1>

      {goals.map((goal) => (
        <GoalCard key={goal._id} goal={goal} />
      ))}
    </div>
  );
}

export default GoalsPage;
