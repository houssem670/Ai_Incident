import api from "./api";

export async function getIncidents() {
    const response = await api.get("/api/incidents/");
    return response.data;
}

export async function getIncident(id) {
    const response = await api.get(`/api/incidents/${id}`);
    return response.data;
}

export async function updateIncidentStatus(id, status) {
    const response = await api.patch(
        `/api/incidents/${id}/status`,
        JSON.stringify(status),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
}

export async function assignIncident(id, assignedTo) {
    const response = await api.patch(`/api/incidents/${id}/assign`, {
        assigned_to: assignedTo,
    });

    return response.data;
}

export async function deleteIncident(id) {
    await api.delete(`/api/incidents/${id}`);
}