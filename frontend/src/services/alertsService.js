import api from "./api";

export async function getAlerts() {
    const response = await api.get("/api/alerts");
    return response.data;
}

export async function getAlert(id) {
    const response = await api.get(`/api/alerts/${id}`);
    return response.data;
}