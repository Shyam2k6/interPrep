import api from "./api";

export const chatWithAI = async (message, token) => {
  const response = await api.post(
    "/ai/chat",
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const generateRoadmap = async (goal, token) => {
  const response = await api.post(
    "/ai/roadmap",
    { goal },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
