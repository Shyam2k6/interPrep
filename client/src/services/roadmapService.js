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

export const toggleStep = async (roadmapId, stepId, token) => {
  const response = await api.patch(
    `/roadmaps/${roadmapId}/steps/${stepId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const deleteRoadmap = async (roadmapId, token) => {
  const response = await api.delete(`/roadmaps/${roadmapId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const studyStep = async (roadmapId, stepId, studyData, token) => {
  const response = await api.post(
    `/roadmaps/${roadmapId}/steps/${stepId}/study`,
    studyData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
