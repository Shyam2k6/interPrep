import api from "./api";

export const createStudySession = async (sessionData, token) => {
  const response = await api.post("/study-sessions", sessionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStudySessions = async (token) => {
  const response = await api.get("/study-sessions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateStudySession = async (sessionId, sessionData, token) => {
  const response = await api.patch(
    `/study-sessions/${sessionId}`,
    sessionData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const deleteStudySession = async (sessionId, token) => {
  const response = await api.delete(`/study-sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStudySessionStats = async (token) => {
  const response = await api.get("/study-sessions/stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
