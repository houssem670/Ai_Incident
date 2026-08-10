import api from "./api";

function clean(value) {
  return value === "" || value === null || value === undefined ? undefined : value;
}

export async function getLogs(params = {}) {
  const response = await api.get("/api/logs/", {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 20,

      search: clean(params.search),
      severity: clean(params.severity),
      source_ip: clean(params.source_ip),
      country: clean(params.country),
      status_code: params.status_code === "" || params.status_code === undefined || params.status_code === null
        ? undefined
        : Number(params.status_code),
      log_type: clean(params.log_type),
      date_from: clean(params.date_from),
      date_to: clean(params.date_to),

      sort_field: params.sort_field ?? "created_at",
      sort_order: params.sort_order ?? "desc",
    },
  });

  return response.data;
}

export async function getLogDetails(id) {
  const response = await api.get(`/api/logs/${id}`);
  return response.data;
}