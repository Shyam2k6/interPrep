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
import { GOAL_CATEGORIES } from "../constants/goalCategories";
import EmptyState from "../components/EmptyState";
import { CardSkeleton } from "../components/ui/Skeleton";

function GoalsPage() {
  const [goals, setGoals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  let filteredGoals = goals;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  if (normalizedSearch) {
    filteredGoals = filteredGoals.filter((goal) =>
      goal.title.toLowerCase().includes(normalizedSearch),
    );
  }

  if (selectedCategory != "All") {
    filteredGoals = filteredGoals.filter(
      (goal) => goal.category === selectedCategory,
    );
  }

  const sortedGoals = [...filteredGoals];

  switch (sortBy) {
    case "newest":
      sortedGoals.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "oldest":
      sortedGoals.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case "title":
      sortedGoals.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "progress":
      sortedGoals.sort((a, b) => b.progress - a.progress);
      break;
    default:
      break;
  }

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        const data = await getGoals(token);
        setGoals(data.data.goal);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
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

  const handleUpdateGoal = async (goalId, updatedData) => {
    try {
      const data = await updateGoal(
        goalId,
        updatedData,
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
    <div className="space-y-6 animate-fadeIn">
      <header className="rounded-3xl bg-[#e2583e] p-6 shadow-lg shadow-orange-500/10 text-white border-none">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/85">
          Goals
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
          Keep your priorities visible.
        </h1>
        <p className="mt-2 text-sm text-white/90">
          Track what matters and move one step forward each day.
        </p>
      </header>

      <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
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
          <div className="grid grid-cols-2 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            >
              <option value="All">All Categories</option>

              {GOAL_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-900"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="progress">Progress (High-Low)</option>
            </select>
          </div>

          {loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : goals.length === 0 ? (
            <EmptyState
              title="No goals set yet"
              description="Start mapping your milestones by creating your first learning priority goal on the left panel."
              icon="goals"
            />
          ) : filteredGoals.length > 0 ? (
            sortedGoals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                onDelete={handleDeleteGoal}
                onUpdate={handleUpdateGoal}
              />
            ))
          ) : (
            <EmptyState
              title="No goals found"
              description="We couldn't find any goals matching your search or filters. Try adjusting your search term."
              icon="empty"
            />
          )}
        </section>
      </div>
    </div>
  );
}

export default GoalsPage;
