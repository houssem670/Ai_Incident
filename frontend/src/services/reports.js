import api from "./api";

export async function getReports({
    page = 1,
    limit = 10,
    report_type = "",
    risk_level = "",
} = {}) {

    const params = {
        page,
        limit,
    };

    if (report_type) {
        params.report_type = report_type;
    }

    if (risk_level) {
        params.risk_level = risk_level;
    }

    const response = await api.get("/api/reports/", {
        params,
    });

    return response.data;
}


export async function getReport(reportId) {

    const response = await api.get(
        `/api/reports/${reportId}`
    );

    return response.data;
}


export async function deleteReport(reportId) {

    const response = await api.delete(
        `/api/reports/${reportId}`
    );

    return response.data;
}