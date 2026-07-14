export function getDeadlineStatus(goal) {
  if (!goal.deadline) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deadlineDate = new Date(goal.deadline);
  deadlineDate.setHours(0, 0, 0, 0);

  if (goal.status === "completed") {
    return "completed";
  }

  if (deadlineDate < today) {
    return "overdue";
  }

  if (deadlineDate.getTime() === today.getTime()) {
    return "today";
  }

  return "upcoming";
}
