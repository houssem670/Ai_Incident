import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { getAlerts } from "../../services/alertsService";
import AlertsTable from "./AlertsTable";

export default function Alerts() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAlerts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getAlerts();

            setAlerts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to load alerts:", err);

            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Unable to load security alerts."
            );

            setAlerts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlerts();
    }, []);

    const totalAlerts = alerts.length;

    const criticalAlerts = alerts.filter(
        (alert) =>
            String(alert?.severity || alert?.risk_level || "")
                .toLowerCase() === "critical"
    ).length;

    const highAlerts = alerts.filter(
        (alert) =>
            String(alert?.severity || alert?.risk_level || "")
                .toLowerCase() === "high"
    ).length;

    const mediumAlerts = alerts.filter(
        (alert) =>
            String(alert?.severity || alert?.risk_level || "")
                .toLowerCase() === "medium"
    ).length;

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100%",
                p: { xs: 2, md: 3 },
            }}
        >
            {/* Header */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{ mb: 0.5 }}
                    >
                        <NotificationsActiveIcon
                            sx={{
                                fontSize: 32,
                                color: "primary.main",
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight={700}
                        >
                            Security Alerts
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Monitor, investigate and manage detected security
                        alerts.
                    </Typography>
                </Box>

                <Tooltip title="Refresh alerts">
                    <IconButton
                        onClick={loadAlerts}
                        disabled={loading}
                        sx={{
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 2,
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Stack>

            {/* Error */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    action={
                        <IconButton
                            color="inherit"
                            size="small"
                            onClick={loadAlerts}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            )}

            {/* Statistics */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >
                {/* Total */}
                <Card
                    elevation={0}
                    sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 3,
                    }}
                >
                    <CardContent>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Total Alerts
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ mt: 0.5 }}
                                >
                                    {totalAlerts}
                                </Typography>
                            </Box>

                            <NotificationsActiveIcon
                                sx={{
                                    fontSize: 36,
                                    color: "primary.main",
                                }}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Critical */}
                <Card
                    elevation={0}
                    sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 3,
                    }}
                >
                    <CardContent>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Critical
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ mt: 0.5 }}
                                >
                                    {criticalAlerts}
                                </Typography>
                            </Box>

                            <WarningAmberIcon
                                sx={{
                                    fontSize: 36,
                                    color: "error.main",
                                }}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* High */}
                <Card
                    elevation={0}
                    sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 3,
                    }}
                >
                    <CardContent>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    High
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ mt: 0.5 }}
                                >
                                    {highAlerts}
                                </Typography>
                            </Box>

                            <WarningAmberIcon
                                sx={{
                                    fontSize: 36,
                                    color: "warning.main",
                                }}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Medium */}
                <Card
                    elevation={0}
                    sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 3,
                    }}
                >
                    <CardContent>
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Medium
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={700}
                                    sx={{ mt: 0.5 }}
                                >
                                    {mediumAlerts}
                                </Typography>
                            </Box>

                            <InfoOutlinedIcon
                                sx={{
                                    fontSize: 36,
                                    color: "info.main",
                                }}
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Box>

            {/* Alerts table */}
            <Card
                elevation={0}
                sx={{
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                }}
            >
                {loading ? (
                    <Box
                        sx={{
                            minHeight: 350,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Stack
                            spacing={2}
                            alignItems="center"
                        >
                            <CircularProgress />

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Loading security alerts...
                            </Typography>
                        </Stack>
                    </Box>
                ) : (
                    <AlertsTable alerts={alerts} />
                )}
            </Card>
        </Box>
    );
}
