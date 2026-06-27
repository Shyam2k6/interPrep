import api from "./api";

export const getRoadmaps = async (token) => {
  const response = await api.get("/roadmaps", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createRoadmap = async (roadmapData, token) => {
  const response = await api.post("/roadmaps", roadmapData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
