import api from "./api";

export const getRoadmaps = async (token) => {
  const response = await api.get("/roadmaps", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
