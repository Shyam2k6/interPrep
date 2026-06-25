import api from "./api";

export const getGoals = async (token) => {
  const response = await api.get("/goals", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createGoal = async (goalData, token) => {
  const response = await api.post("/goals", goalData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteGoal = async (goalId, token) => {
  const response = await api.delete(`/goals/${goalId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateGoal = async (goalId, goalData, token) => {
  const response = await api.patch(`/goals/${goalId}`, goalData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
