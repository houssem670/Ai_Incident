import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography, Box } from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import TodayIcon from "@mui/icons-material/Today";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import BugReportIcon from "@mui/icons-material/BugReport";
import LinkIcon from "@mui/icons-material/Link";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

export default function KPICards({ data }) {
    if (!data) return null;

    const cards = [
        {
            title: "Total Logs",
            value: data.total_logs,
            icon: <DescriptionIcon />,
            color: "#42a5f5",
        },
        {
            title: "Logs Today",
            value: data.logs_today,
            icon: <TodayIcon />,
            color: "#66bb6a",
        },
        {
            title: "Critical Incidents",
            value: data.critical_incidents,
            icon: <WarningAmberIcon />,
            color: "#ef5350",
        },
        {
            title: "IOC Detected",
            value: data.ioc_detected,
            icon: <BugReportIcon />,
            color: "#ab47bc",
        },
        {
            title: "URL Analysed",
            value: data.url_analyzed,
            icon: <LinkIcon />,
            color: "#26c6da",
        },
        {
            title: "Alerts Sent",
            value: data.alerts_sent,
            icon: <NotificationsActiveIcon />,
            color: "#ffa726",
        },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            {cards.map((card) => (
                <Grid xs={12} md={6} lg={2} key={card.title}>
                    <Card sx={{ borderRadius: 3, height: "100%" }}>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    mb: 1,
                                }}
                            >
                                <Typography color="text.secondary">
                                    {card.title}
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        bgcolor: `${card.color}22`,
                                        color: card.color,
                                    }}
                                >
                                    {card.icon}
                                </Box>
                            </Box>
                            <Typography variant="h4" fontWeight="bold">
                                {card.value}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}