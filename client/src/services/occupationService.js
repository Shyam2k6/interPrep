import api from "./api";

export const getOccupations = async (token) => {
  const response = await api.get("/occupations", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getOccupationById = async (id, token) => {
  const response = await api.get(`/occupations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
