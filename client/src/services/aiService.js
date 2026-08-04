import api from "./api";

export const chatWithAI = async (message, conversationId, token) => {
  const response = await api.post(
    "/ai/chat",
    {
      message,
      conversationId,
    },
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

export const getConversations = async (token) => {
  const response = await api.get("/ai/conversations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getChatHistory = async (conversationId, token) => {
  const response = await api.get(
    `/ai/history?conversationId=${conversationId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const deleteConversation = async (conversationId, token) => {
  const response = await api.delete(`/ai/conversations/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const renameConversation = async (conversationId, title, token) => {
  const response = await api.patch(
    `/ai/conversations/${conversationId}`,
    { title },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
