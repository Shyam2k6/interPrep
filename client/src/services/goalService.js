import api from "./api";

export const getGoals = async (token) => {
  const response = await api.get("/goals", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
