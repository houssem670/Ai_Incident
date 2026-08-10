import { useEffect, useState } from "react";

import { Paper, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { getRecentLogs } from "../../services/dashboardService";

export default function RecentLogsTable() {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getRecentLogs();
                setRows(result);
            } catch (err) {
                console.error(err);
            }
        }

        loadData();
    }, []);

    const columns = [
        { field: "created_at", headerName: "Date", flex: 1.3 },
        { field: "source_ip", headerName: "Source IP", flex: 1.1 },
        { field: "request_url", headerName: "URL", flex: 1.5 },
        { field: "severity", headerName: "Severity", flex: 0.8 },
        { field: "risk_score", headerName: "Risk Score", flex: 0.8 },
        { field: "status_code", headerName: "Status", flex: 0.7 },
        { field: "ai_analyzed", headerName: "IA Analysed", flex: 0.8, valueGetter: (value) => value ? "Yes" : "No" },
        { field: "notification_sent", headerName: "Notification Sent", flex: 1, valueGetter: (value) => value ? "Yes" : "No" },
    ];

    return (
        <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
                Latest Security Events
            </Typography>

            <div style={{ height: 520, width: "100%" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[10, 20]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    disableRowSelectionOnClick
                />
            </div>
        </Paper>
    );
}