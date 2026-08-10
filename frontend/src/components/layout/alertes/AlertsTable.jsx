import { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Chip, IconButton
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AlertDetailDialog from "./AlertDetailDialog";

const severityColor = {
    Critical: "error",
    High: "warning",
    Medium: "info",
    Low: "success",
};

export default function AlertsTable({ alerts }) {
    const [selected, setSelected] = useState(null);

    return (
        <>
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Source IP</TableCell>
                            <TableCell>Risk Level</TableCell>
                            <TableCell>Attack Type</TableCell>
                            <TableCell>Sent</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {alerts.map((alert) => (
                            <TableRow key={alert.id} hover>
                                <TableCell>{alert.alert_title}</TableCell>
                                <TableCell>{alert.source_ip}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={alert.risk_level}
                                        color={severityColor[alert.risk_level] || "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{alert.attack_type}</TableCell>
                                <TableCell>
                                    {alert.sent_email ? "📧" : ""} {alert.sent_slack ? "💬" : ""}
                                </TableCell>
                                <TableCell>
                                    {new Date(alert.created_at).toLocaleString()}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => setSelected(alert)}>
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <AlertDetailDialog
                alert={selected}
                open={Boolean(selected)}
                onClose={() => setSelected(null)}
            />
        </>
    );
}