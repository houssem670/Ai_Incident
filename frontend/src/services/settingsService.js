import api from "./api";

export const getSettings = async () => {
  const response = await api.get("/api/settings");
  return response.data;
};

export const updateSettings = async (data) => {
  const response = await api.put("/api/settings", data);
  return response.data;
};

export const purgeOldLogs = async () => {
  const response = await api.post("/api/settings/purge-logs");
  return response.data;
};

export const getInternalApiKey = async () => {
  const response = await api.get("/api/settings/internal-api-key");
  return response.data;
};