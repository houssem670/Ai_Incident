import { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    Stack,
    Typography,
} from "@mui/material";

import {
    Delete,
    Description,
    Security,
    Visibility,
    Close,
    TrendingUp,
    Assessment,
    Warning,
    Public,
} from "@mui/icons-material";

import {
    getReports,
    deleteReport,
} from "../services/reports";


/* ============================================================
   Helpers
============================================================ */

function getRiskColor(risk) {
    switch (String(risk || "").toUpperCase()) {
        case "CRITICAL":
            return "error";

        case "HIGH":
            return "error";

        case "MEDIUM":
            return "warning";

        case "LOW":
            return "success";

        default:
            return "default";
    }
}


function getRiskBorderColor(risk) {
    switch (String(risk || "").toUpperCase()) {
        case "CRITICAL":
            return "#d32f2f";

        case "HIGH":
            return "#f44336";

        case "MEDIUM":
            return "#ff9800";

        case "LOW":
            return "#2e7d32";

        default:
            return "#607d8b";
    }
}


function formatDate(date) {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}


function formatDateTime(date) {
    if (!date) {
        return "N/A";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
        return "N/A";
    }

    return parsedDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}


function parseArray(value) {
    if (!value) {
        return [];
    }

    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value === "string") {
        try {
            const parsed = JSON.parse(value);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch {
            return [value];
        }
    }

    return [];
}


/* ============================================================
   Statistics Card
============================================================ */

function StatCard({
    label,
    value,
    color = "default",
    icon,
}) {
    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 2,
                background:
                    "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
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
                            {label}
                        </Typography>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ mt: 0.5 }}
                        >
                            {value ?? 0}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            color:
                                color === "default"
                                    ? "primary.main"
                                    : `${color}.main`,
                            opacity: 0.9,
                        }}
                    >
                        {icon}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}


/* ============================================================
   Reports Page
============================================================ */

export default function Reports() {

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [page, setPage] = useState(1);

    const [total, setTotal] = useState(0);

    const [limit] = useState(10);

    const [riskLevel, setRiskLevel] = useState("");

    const [reportType, setReportType] = useState("");

    const [selectedReport, setSelectedReport] = useState(null);


    /* ========================================================
       Load reports
    ======================================================== */

    async function loadReports() {
        try {
            setLoading(true);
            setError("");

            const data = await getReports({
                page,
                limit,
                report_type: reportType,
                risk_level: riskLevel,
            });

            setReports(data?.data || []);

            setTotal(data?.total || 0);

        } catch (err) {
            console.error("Failed to load reports:", err);

            setError(
                err?.response?.data?.detail ||
                "Unable to load security reports."
            );
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        loadReports();
    }, [page, riskLevel, reportType]);


    /* ========================================================
       Delete report
    ======================================================== */

    async function handleDelete(id) {

        const confirmed = window.confirm(
            "Are you sure you want to delete this security report?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteReport(id);

            if (selectedReport?.id === id) {
                setSelectedReport(null);
            }

            await loadReports();

        } catch (err) {
            console.error("Failed to delete report:", err);

            setError(
                err?.response?.data?.detail ||
                "Unable to delete the report."
            );
        }
    }


    /* ========================================================
       Open report
    ======================================================== */

    function handleView(report) {
        setSelectedReport(report);
    }


    /* ========================================================
       Loading
    ======================================================== */

    if (loading && reports.length === 0) {
        return (
            <Box
                sx={{
                    minHeight: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    /* ========================================================
       Render
    ======================================================== */

    return (
        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 3,
                },
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

            <Stack
                direction={{
                    xs: "column",
                    sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                    xs: "flex-start",
                    sm: "center",
                }}
                spacing={2}
                mb={3}
            >

                <Box>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <Description
                            sx={{
                                fontSize: 36,
                                color: "primary.main",
                            }}
                        />

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            Security Reports
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        AI-generated cybersecurity reports and security assessments
                    </Typography>

                </Box>

                <Chip
                    icon={<Security />}
                    label="AI Security Analyst"
                    color="primary"
                    variant="outlined"
                />

            </Stack>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}


            {/* ==================================================
                FILTERS
            ================================================== */}

            <Card
                sx={{
                    mb: 3,
                    borderRadius: 2,
                }}
            >

                <CardContent>

                    <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ mb: 2 }}
                    >
                        Report Filters
                    </Typography>

                    <Stack
                        direction={{
                            xs: "column",
                            sm: "row",
                        }}
                        spacing={2}
                    >

                        <FormControl
                            size="small"
                            sx={{
                                minWidth: 200,
                            }}
                        >

                            <InputLabel>
                                Report Type
                            </InputLabel>

                            <Select
                                value={reportType}
                                label="Report Type"
                                onChange={(event) => {
                                    setPage(1);
                                    setReportType(
                                        event.target.value
                                    );
                                }}
                            >

                                <MenuItem value="">
                                    All reports
                                </MenuItem>

                                <MenuItem value="weekly">
                                    Weekly
                                </MenuItem>

                                <MenuItem value="monthly">
                                    Monthly
                                </MenuItem>

                            </Select>

                        </FormControl>


                        <FormControl
                            size="small"
                            sx={{
                                minWidth: 200,
                            }}
                        >

                            <InputLabel>
                                Risk Level
                            </InputLabel>

                            <Select
                                value={riskLevel}
                                label="Risk Level"
                                onChange={(event) => {
                                    setPage(1);
                                    setRiskLevel(
                                        event.target.value
                                    );
                                }}
                            >

                                <MenuItem value="">
                                    All risk levels
                                </MenuItem>

                                <MenuItem value="CRITICAL">
                                    Critical
                                </MenuItem>

                                <MenuItem value="HIGH">
                                    High
                                </MenuItem>

                                <MenuItem value="MEDIUM">
                                    Medium
                                </MenuItem>

                                <MenuItem value="LOW">
                                    Low
                                </MenuItem>

                            </Select>

                        </FormControl>

                    </Stack>

                </CardContent>

            </Card>


            {/* ==================================================
                REPORT LIST
            ================================================== */}

            {reports.length === 0 ? (

                <Card>

                    <CardContent
                        sx={{
                            py: 6,
                            textAlign: "center",
                        }}
                    >

                        <Description
                            sx={{
                                fontSize: 50,
                                color: "text.secondary",
                                mb: 1,
                            }}
                        />

                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            No security reports found
                        </Typography>

                        <Typography
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Try changing the selected filters.
                        </Typography>

                    </CardContent>

                </Card>

            ) : (

                <Stack spacing={2}>

                    {reports.map((report) => {

                        const risk = String(
                            report.risk_level || ""
                        ).toUpperCase();

                        return (
                            <Card
                                key={report.id}
                                sx={{
                                    borderLeft: `4px solid ${getRiskBorderColor(
                                        risk
                                    )}`,
                                    borderRadius: 2,
                                    transition:
                                        "transform 0.15s ease, box-shadow 0.15s ease",

                                    "&:hover": {
                                        transform:
                                            "translateY(-2px)",
                                        boxShadow:
                                            "0 8px 25px rgba(0,0,0,0.25)",
                                    },
                                }}
                            >

                                <CardContent>

                                    <Stack
                                        direction={{
                                            xs: "column",
                                            md: "row",
                                        }}
                                        justifyContent="space-between"
                                        spacing={3}
                                    >

                                        {/* Report identity */}

                                        <Box
                                            sx={{
                                                minWidth: 0,
                                                flex: 1,
                                            }}
                                        >

                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                            >
                                                {report.title ||
                                                    "Security Report"}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ mt: 0.5 }}
                                            >
                                                Reporting period:{" "}
                                                {formatDate(
                                                    report.period_start
                                                )}
                                                {" → "}
                                                {formatDate(
                                                    report.period_end
                                                )}
                                            </Typography>

                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                flexWrap="wrap"
                                                sx={{ mt: 1.5 }}
                                            >

                                                <Chip
                                                    label={
                                                        report.report_type ||
                                                        "Report"
                                                    }
                                                    size="small"
                                                />

                                                <Chip
                                                    label={
                                                        risk ||
                                                        "UNKNOWN"
                                                    }
                                                    color={getRiskColor(
                                                        risk
                                                    )}
                                                    size="small"
                                                />

                                                <Chip
                                                    label={`Incidents: ${
                                                        report.total_incidents ??
                                                        0
                                                    }`}
                                                    size="small"
                                                    variant="outlined"
                                                />

                                            </Stack>

                                        </Box>


                                        {/* Actions */}

                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                        >

                                            <Button
                                                variant="outlined"
                                                startIcon={
                                                    <Visibility />
                                                }
                                                onClick={() =>
                                                    handleView(report)
                                                }
                                            >
                                                View
                                            </Button>

                                            <Button
                                                color="error"
                                                variant="outlined"
                                                startIcon={
                                                    <Delete />
                                                }
                                                onClick={() =>
                                                    handleDelete(
                                                        report.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </Button>

                                        </Stack>

                                    </Stack>

                                </CardContent>

                            </Card>
                        );
                    })}

                </Stack>
            )}


            {/* ==================================================
                PAGINATION
            ================================================== */}

            {total > limit && (

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 4,
                    }}
                >

                    <Pagination
                        count={Math.ceil(
                            total / limit
                        )}
                        page={page}
                        onChange={(_, value) =>
                            setPage(value)
                        }
                        color="primary"
                        disabled={loading}
                    />

                </Box>

            )}


            {/* ==================================================
                REPORT DETAILS DIALOG
            ================================================== */}

            <Dialog
                open={Boolean(selectedReport)}
                onClose={() =>
                    setSelectedReport(null)
                }
                fullWidth
                maxWidth="lg"
                scroll="paper"
            >

                {selectedReport && (

                    <>

                        {/* ===============================
                            Dialog header
                        =============================== */}

                        <DialogTitle
                            sx={{
                                pr: 7,
                            }}
                        >

                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                            >

                                <Assessment
                                    color="primary"
                                />

                                <Box>

                                    <Typography
                                        variant="h5"
                                        fontWeight="bold"
                                    >
                                        {selectedReport.title ||
                                            "Security Report"}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {formatDate(
                                            selectedReport.period_start
                                        )}
                                        {" → "}
                                        {formatDate(
                                            selectedReport.period_end
                                        )}
                                    </Typography>

                                </Box>

                            </Stack>

                            <IconButton
                                onClick={() =>
                                    setSelectedReport(null)
                                }
                                sx={{
                                    position: "absolute",
                                    right: 12,
                                    top: 12,
                                }}
                            >
                                <Close />
                            </IconButton>

                        </DialogTitle>


                        <DialogContent dividers>

                            {/* ===============================
                                Report metadata
                            =============================== */}

                            <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                sx={{ mb: 3 }}
                            >

                                <Chip
                                    label={
                                        selectedReport.report_type ||
                                        "Report"
                                    }
                                />

                                <Chip
                                    label={
                                        String(
                                            selectedReport.risk_level ||
                                            "UNKNOWN"
                                        ).toUpperCase()
                                    }
                                    color={getRiskColor(
                                        selectedReport.risk_level
                                    )}
                                />

                                <Chip
                                    label={`Generated: ${formatDateTime(
                                        selectedReport.created_at
                                    )}`}
                                    variant="outlined"
                                />

                            </Stack>


                            {/* ===============================
                                Executive statistics
                            =============================== */}

                            <Typography
                                variant="h6"
                                fontWeight="bold"
                                sx={{ mb: 2 }}
                            >
                                Executive Overview
                            </Typography>

                            <Grid
                                container
                                spacing={2}
                                sx={{ mb: 4 }}
                            >

                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                >
                                    <StatCard
                                        label="Total Incidents"
                                        value={
                                            selectedReport.total_incidents
                                        }
                                        icon={
                                            <Warning />
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                >
                                    <StatCard
                                        label="Critical"
                                        value={
                                            selectedReport.critical
                                        }
                                        color="error"
                                        icon={
                                            <Warning />
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                >
                                    <StatCard
                                        label="High"
                                        value={
                                            selectedReport.high
                                        }
                                        color="error"
                                        icon={
                                            <TrendingUp />
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                >
                                    <StatCard
                                        label="Medium"
                                        value={
                                            selectedReport.medium
                                        }
                                        color="warning"
                                        icon={
                                            <Assessment />
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                >
                                    <StatCard
                                        label="Low"
                                        value={
                                            selectedReport.low
                                        }
                                        color="success"
                                        icon={
                                            <Security />
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                >
                                    <StatCard
                                        label="Analyzed"
                                        value={
                                            selectedReport.analyzed
                                        }
                                        icon={
                                            <Assessment />
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                >
                                    <StatCard
                                        label="Pending"
                                        value={
                                            selectedReport.pending
                                        }
                                        icon={
                                            <Warning />
                                        }
                                    />
                                </Grid>

                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={3}
                                >
                                    <StatCard
                                        label="Distinct Sources"
                                        value={
                                            selectedReport.distinct_sources ??
                                            0
                                        }
                                        icon={
                                            <Public />
                                        }
                                    />
                                </Grid>

                            </Grid>


                            {/* ===============================
                                Summary
                            =============================== */}

                            <Card
                                variant="outlined"
                                sx={{ mb: 3 }}
                            >

                                <CardContent>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ mb: 1 }}
                                    >
                                        Executive Summary
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{
                                            lineHeight: 1.8,
                                        }}
                                    >
                                        {selectedReport.summary ||
                                            "No summary available."}
                                    </Typography>

                                </CardContent>

                            </Card>


                            {/* ===============================
                                Risk assessment
                            =============================== */}

                            <Card
                                variant="outlined"
                                sx={{
                                    mb: 3,
                                    borderLeft: `5px solid ${getRiskBorderColor(
                                        selectedReport.risk_level
                                    )}`,
                                }}
                            >

                                <CardContent>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ mb: 1 }}
                                    >
                                        Risk Assessment
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                    >

                                        <Chip
                                            label={String(
                                                selectedReport.risk_level ||
                                                "UNKNOWN"
                                            ).toUpperCase()}
                                            color={getRiskColor(
                                                selectedReport.risk_level
                                            )}
                                        />

                                        <Typography
                                            color="text.secondary"
                                        >
                                            {selectedReport.risk_assessment ||
                                                "No risk assessment available."}
                                        </Typography>

                                    </Stack>

                                </CardContent>

                            </Card>


                            {/* ===============================
                                Key findings
                            =============================== */}

                            <Card
                                variant="outlined"
                                sx={{ mb: 3 }}
                            >

                                <CardContent>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ mb: 2 }}
                                    >
                                        Key Findings
                                    </Typography>

                                    {parseArray(
                                        selectedReport.key_findings
                                    ).length > 0 ? (

                                        <Stack spacing={1.2}>

                                            {parseArray(
                                                selectedReport.key_findings
                                            ).map(
                                                (
                                                    finding,
                                                    index
                                                ) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            gap: 1,
                                                            alignItems:
                                                                "flex-start",
                                                            p: 1.5,
                                                            borderRadius: 1,
                                                            background:
                                                                "rgba(255,255,255,0.03)",
                                                        }}
                                                    >

                                                        <Chip
                                                            label={
                                                                index + 1
                                                            }
                                                            size="small"
                                                            color="primary"
                                                        />

                                                        <Typography
                                                            color="text.secondary"
                                                            sx={{
                                                                lineHeight:
                                                                    1.6,
                                                            }}
                                                        >
                                                            {finding}
                                                        </Typography>

                                                    </Box>
                                                )
                                            )}

                                        </Stack>

                                    ) : (

                                        <Typography
                                            color="text.secondary"
                                        >
                                            No key findings available.
                                        </Typography>

                                    )}

                                </CardContent>

                            </Card>


                            {/* ===============================
                                Recommendations
                            =============================== */}

                            <Card
                                variant="outlined"
                                sx={{ mb: 3 }}
                            >

                                <CardContent>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ mb: 2 }}
                                    >
                                        Recommendations
                                    </Typography>

                                    {parseArray(
                                        selectedReport.recommendations
                                    ).length > 0 ? (

                                        <Stack spacing={1.2}>

                                            {parseArray(
                                                selectedReport.recommendations
                                            ).map(
                                                (
                                                    recommendation,
                                                    index
                                                ) => (
                                                    <Box
                                                        key={index}
                                                        sx={{
                                                            display:
                                                                "flex",
                                                            gap: 1,
                                                            alignItems:
                                                                "flex-start",
                                                            p: 1.5,
                                                            borderRadius: 1,
                                                            background:
                                                                "rgba(46,125,50,0.08)",
                                                            border:
                                                                "1px solid rgba(46,125,50,0.15)",
                                                        }}
                                                    >

                                                        <Chip
                                                            label={
                                                                index + 1
                                                            }
                                                            size="small"
                                                            color="success"
                                                        />

                                                        <Typography
                                                            color="text.secondary"
                                                            sx={{
                                                                lineHeight:
                                                                    1.6,
                                                            }}
                                                        >
                                                            {recommendation}
                                                        </Typography>

                                                    </Box>
                                                )
                                            )}

                                        </Stack>

                                    ) : (

                                        <Typography
                                            color="text.secondary"
                                        >
                                            No recommendations available.
                                        </Typography>

                                    )}

                                </CardContent>

                            </Card>


                            {/* ===============================
                                Top source
                            =============================== */}

                            <Card
                                variant="outlined"
                                sx={{ mb: 3 }}
                            >

                                <CardContent>

                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{ mb: 1 }}
                                    >

                                        <Public color="primary" />

                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                        >
                                            Top Attack Source
                                        </Typography>

                                    </Stack>

                                    <Typography
                                        color="text.secondary"
                                    >
                                        <strong>
                                            {selectedReport.top_ip ||
                                                "N/A"}
                                        </strong>
                                        {" generated "}
                                        <strong>
                                            {selectedReport.top_ip_count ??
                                                0}
                                        </strong>
                                        {" request(s)."}
                                    </Typography>

                                </CardContent>

                            </Card>


                            {/* ===============================
                                Trend
                            =============================== */}

                            <Card
                                variant="outlined"
                            >

                                <CardContent>

                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        sx={{ mb: 1 }}
                                    >
                                        Weekly Trend
                                    </Typography>

                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        flexWrap="wrap"
                                    >

                                        <Chip
                                            label={`Previous period: ${
                                                selectedReport.previous_week_total ??
                                                0
                                            }`}
                                        />

                                        <Chip
                                            label={`Change: ${
                                                selectedReport.trend ??
                                                0
                                            }`}
                                            color={
                                                Number(
                                                    selectedReport.trend
                                                ) > 0
                                                    ? "error"
                                                    : "success"
                                            }
                                        />

                                    </Stack>

                                </CardContent>

                            </Card>

                        </DialogContent>


                        <DialogActions>

                            <Button
                                onClick={() =>
                                    setSelectedReport(null)
                                }
                            >
                                Close
                            </Button>

                        </DialogActions>

                    </>
                )}

            </Dialog>

        </Box>
    );
}