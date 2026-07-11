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
  const [searchTerm, setSearchTerm] = useState("");
  const { token } = useAuth();

  const filteredGoals = goals.filter((goal) =>
    goal.title.toLowerCase().includes(searchTerm.trim().toLowerCase()),
  );

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
        { status: "completed", progress: 100 },
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
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
          Goals
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Keep your priorities visible.
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Track what matters and move one step forward each day.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <GoalForm onAddGoal={handleAddGoal} />
        </section>

        <section className="space-y-4">
          <input
            type="text"
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
          />
          {goals.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
              No goals yet. Add your first one to get started.
            </div>
          ) : filteredGoals.length > 0 ? (
            filteredGoals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onDelete={handleDeleteGoal}
                onUpdate={handleUpdateGoal}
              />
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No goals found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try searching with a different keyword.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default GoalsPage;
