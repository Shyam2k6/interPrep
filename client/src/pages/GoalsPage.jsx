import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import GoalCard from "../components/GoalCard";
import GoalForm from "../components/GoalForm";
import { createGoal, getGoals } from "../services/goalService";

function GoalsPage() {
  const [goals, setGoals] = useState([]);

  const { token } = useAuth();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const data = await getGoals(token);

        setGoals(data.data.goal);
      } catch (error) {
        console.log(error);
      }
    };

    fetchGoals();
  }, [token]);

  const handleAddGoal = async (goalData) => {
    try {
      const data = await createGoal(goalData, token);
      setGoals((prevGoals) => [...prevGoals, data.data.goal]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>My Goals</h1>

      <GoalForm onAddGoal={handleAddGoal} />

      {goals.map((goal) => (
        <GoalCard key={goal._id} goal={goal} />
      ))}
    </div>
  );
}

export default GoalsPage;
