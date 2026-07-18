import api from "./api";

export const createStudySession = async (sessionData, token) => {
  const response = await api.post("/study-session", sessionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getStudySessions = async (token) => {
  const response = await api.get("/study-session", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateStudySession = async (sessionId, sessionData, token) => {
  const response = await api.patch(`/study-session/${sessionId}`, sessionData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteStudySession = async (sessionId, token) => {
  const response = await api.delete(`study-session/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
