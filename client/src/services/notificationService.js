import api from "./api";

export const getNotifications = async (token) => {
  const response = await api.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const markAsRead = async (id, token) => {
  const response = await api.patch(`/notifications/${id}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const markAllAsRead = async (token) => {
  const response = await api.patch("/notifications/read-all", {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteNotification = async (id, token) => {
  const response = await api.delete(`/notifications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const clearAllNotifications = async (token) => {
  const response = await api.delete("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
