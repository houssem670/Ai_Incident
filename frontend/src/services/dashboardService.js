import api from "./api";

export const getDashboard = async () => {
    const response = await api.get("/api/dashboard/");
    return response.data;
};

export const getSeverity = async () => {
    const response = await api.get("/api/dashboard/severity");
    return response.data;
};

export const getStatus = async () => {
    const response = await api.get("/api/dashboard/status");
    return response.data;
};

export const getTopIPs = async () => {
    const response = await api.get("/api/dashboard/top-ips");
    return response.data;
};

export const getTopUrls = async () => {
    const response = await api.get("/api/dashboard/top-urls");
    return response.data;
};

export const getCountries = async () => {
    const response = await api.get("/api/dashboard/countries");
    return response.data;
};

export const getTimeline = async (range = "24h") => {
    const response = await api.get("/api/dashboard/timeline", {
        params: { range }
    });
    return response.data;
};

export const getRecentLogs = async () => {
    const response = await api.get("/api/dashboard/recent-logs");
    return response.data;
};