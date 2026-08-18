import api from "./api";

export const getCareerProfile = async (token) => {
  const response = await api.get("/career/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCareerProfile = async (profileData, token) => {
  const response = await api.patch("/career/profile", profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCareerTransitions = async (token) => {
  const response = await api.get("/career/transitions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const setTargetCareer = async (targetName, token) => {
  const response = await api.post(
    "/career/targets",
    { targetName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const resetCareerProfile = async (token) => {
  const response = await api.delete("/career/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const enhanceRoadmap = async (skillNames, token) => {
  const response = await api.post(
    "/career/roadmap-enhance",
    { skillNames },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
