import api from "./api";

export const getSetupStatus = async () => {
  const response = await api.get("/api/setup/status");
  return response.data;
};

export const createFirstAdmin = async (data) => {
  const response = await api.post("/api/setup/create-admin", data);
  return response.data;
};