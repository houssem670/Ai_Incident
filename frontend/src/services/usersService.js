import api from "./api";

export const getUsers = async () => {
  const response = await api.get("/api/users");
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post("/api/users", data);
  return response.data;
};

export const updateUser = async (userId, data) => {
  const response = await api.patch(`/api/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId) => {
  await api.delete(`/api/users/${userId}`);
};