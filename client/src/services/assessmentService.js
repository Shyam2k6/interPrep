import api from "./api";

export const generateQuiz = async (skillName, token) => {
  const response = await api.post(
    "/assessments/generate",
    { skillName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const submitQuiz = async (assessmentId, answers, token) => {
  const response = await api.post(
    "/assessments/submit",
    { assessmentId, answers },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const getQuizHistory = async (token) => {
  const response = await api.get("/assessments/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
