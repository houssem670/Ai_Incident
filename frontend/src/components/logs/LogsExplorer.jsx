import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Chip,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import {
  getLogs,
  getLogDetails,
} from "../../services/logsService";

const columns = [
  {
    field: "created_at",
    headerName: "Date / Time",
    flex: 1.3,
    valueFormatter: (value) =>
      value ? new Date(value).toLocaleString() : "-",
  },
  { field: "source_ip", headerName: "Source IP", flex: 1 },
  { field: "log_type", headerName: "Type", flex: 0.9 },
  { field: "request_url", headerName: "Request URL", flex: 1.7 },
  { field: "status_code", headerName: "HTTP", flex: 0.6 },
  { field: "country", headerName: "Country", flex: 0.8 },
  { field: "risk_score", headerName: "Risk", flex: 0.7 },
  {
    field: "severity",
    headerName: "Severity",
    flex: 0.8,
    renderCell: (params) => {
      const color =
        params.value === "Critical"
          ? "error"
          : params.value === "High"
          ? "warning"
          : params.value === "Medium"
          ? "info"
          : "success";

      return <Chip size="small" label={params.value || "-"} color={color} />;
    },
  },
  {
    field: "enriched",
    headerName: "Enriched",
    flex: 0.8,
    renderCell: (params) =>
      params.value ? (
        <Chip size="small" color="success" label="Yes" />
      ) : (
        <Chip size="small" label="No" />
      ),
  },
  {
    field: "ai_done",
    headerName: "AI",
    flex: 0.7,
    renderCell: (params) =>
      params.value ? (
        <Chip size="small" color="primary" label="Done" />
      ) : (
        <Chip size="small" label="Pending" />
      ),
  },
  {
    field: "notified",
    headerName: "Alert",
    flex: 0.7,
    renderCell: (params) =>
      params.value ? (
        <Chip size="small" color="error" label="Sent" />
      ) : (
        <Chip size="small" label="No" />
      ),
  },
];

export default function LogsExplorer() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });

  const [sortModel, setSortModel] = useState([
    { field: "created_at", sort: "desc" },
  ]);

  const [filters, setFilters] = useState({
    search: "",
    severity: "",
    source_ip: "",
    country: "",
    status_code: "",
    log_type: "",
    date_from: "",
    date_to: "",
  });

  const loadLogs = async (
    page = paginationModel.page + 1,
    pageSize = paginationModel.pageSize
  ) => {
    try {
      setLoading(true);

      const response = await getLogs({
        page,
        limit: pageSize,
        search: filters.search,
        severity: filters.severity,
        source_ip: filters.source_ip,
        country: filters.country,
        status_code: filters.status_code,
        log_type: filters.log_type,
        date_from: filters.date_from,
        date_to: filters.date_to,
        sort_field: sortModel[0]?.field || "created_at",
        sort_order: sortModel[0]?.sort || "desc",
      });

      // ✅ Cas 1 : le backend renvoie { data: [...], total: N }
      setRows(response.data);
      setTotal(response.total);

      // ⚠️ Cas 2 : si ton backend renvoie directement un tableau [...],
      // commente les 2 lignes ci-dessus et décommente celles-ci :
      // setRows(response);
      // setTotal(response.length);

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [paginationModel.page, paginationModel.pageSize, sortModel]);

  const totalPages = useMemo(() => {
    return Math.ceil(total / paginationModel.pageSize);
  }, [total, paginationModel.pageSize]);

  const openLog = async (id) => {
    try {
      const response = await getLogDetails(id);
      setSelectedLog(response);
      setDetailOpen(true);
    } catch {
      setError("Unable to load log details.");
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={700}>
            Logs Explorer
          </Typography>

          <Button variant="contained" onClick={() => loadLogs()} disabled={loading}>
            Refresh
          </Button>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fit,minmax(180px,1fr))"
          gap={2}
        >
          <TextField
            label="Search"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <TextField
            select
            label="Severity"
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>

          <TextField
            label="Source IP"
            value={filters.source_ip}
            onChange={(e) => setFilters({ ...filters, source_ip: e.target.value })}
          />

          <TextField
            label="Country"
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          />

          <TextField
            label="HTTP Code"
            value={filters.status_code}
            onChange={(e) => setFilters({ ...filters, status_code: e.target.value })}
          />

          <TextField
            label="Log Type"
            value={filters.log_type}
            onChange={(e) => setFilters({ ...filters, log_type: e.target.value })}
          />

          <TextField
            label="Date From"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={filters.date_from}
            onChange={(e) =>
              setFilters({
                ...filters,
                date_from: e.target.value,
              })
            }
          />

          <TextField
            label="Date To"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={filters.date_to}
            onChange={(e) =>
              setFilters({
                ...filters,
                date_to: e.target.value,
              })
            }
          />
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={() => {
              const resetFilters = {
                search: "",
                severity: "",
                source_ip: "",
                country: "",
                status_code: "",
                log_type: "",
                date_from: "",
                date_to: "",
              };

              setFilters(resetFilters);

              setPaginationModel({
                page: 0,
                pageSize: 20,
              });

              setTimeout(() => loadLogs(1), 100);
            }}
          >
            Reset
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setPaginationModel({
                ...paginationModel,
                page: 0,
              });

              loadLogs(1);
            }}
          >
            Apply Filters
          </Button>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={400}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ height: 650 }}>
            <DataGrid
              rows={rows}
              getRowId={(row) => row.id}
              columns={columns}
              rowCount={total}
              pagination
              paginationMode="server"
              sortingMode="server"
              pageSizeOptions={[10, 20, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              sortModel={sortModel}
              onSortModelChange={(model) => {
                if (model.length > 0) {
                  setSortModel(model);
                }
              }}
              disableRowSelectionOnClick
              onRowDoubleClick={(params) => openLog(params.row.id)}
            />
          </Box>
        )}

        <Typography variant="body2" color="text.secondary">
          Showing {rows.length} of {total} logs • Page {paginationModel.page + 1} /{" "}
          {Math.max(totalPages, 1)}
        </Typography>

        <Dialog
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Log Details</DialogTitle>

          <DialogContent dividers>
            {selectedLog && (
              <Grid container spacing={2}>
                {Object.entries(selectedLog).map(([key, value]) => (
                  <Grid size={{ xs: 12, md: 6 }} key={key}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        {key}
                      </Typography>
                      <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                        {typeof value === "boolean"
                          ? value
                            ? "Yes"
                            : "No"
                          : value || "-"}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Paper>
  );
}