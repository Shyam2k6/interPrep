import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import GoalCard from "../components/GoalCard";
import GoalForm from "../components/GoalForm";
import {
  createGoal,
  getGoals,
  deleteGoal,
  updateGoal,
} from "../services/goalService";

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

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId, token);

      setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateGoal = async (goalId) => {
    try {
      const data = await updateGoal(
        goalId,
        {
          status: "completed",
          progress: 100,
        },
        token,
      );

      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal._id === goalId ? data.data.goal : goal)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>My Goals</h1>

      <GoalForm onAddGoal={handleAddGoal} />

      {goals.map((goal) => (
        <GoalCard
          key={goal._id}
          goal={goal}
          onDelete={handleDeleteGoal}
          onUpdate={handleUpdateGoal}
        />
      ))}
    </div>
  );
}

export default GoalsPage;
