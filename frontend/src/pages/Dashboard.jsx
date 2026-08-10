import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Alert, Grid } from "@mui/material";

import KPICards from "../components/dashboard/KPICards";
import { getDashboard } from "../services/dashboardService";
import SeverityChart from "../components/dashboard/SeverityChart";
import StatusChart from "../components/dashboard/StatusChart";
import TopIPs from "../components/dashboard/TopIPs";
import TopUrls from "../components/dashboard/TopUrls";
import CountryChart from "../components/dashboard/CountryChart";
import TimelineChart from "../components/dashboard/TimelineChart";
import RecentLogsTable from "../components/dashboard/RecentLogsTable";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboard();
        setDashboard(data);
      } catch (err) {
        setError("Unable to load telemetry. Check the API connection and authentication.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Security Operations Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Real-time SOC posture derived from PostgreSQL telemetry.
      </Typography>

      {error ? <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert> : null}

      <KPICards data={dashboard} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SeverityChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <StatusChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <TopIPs />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <TopUrls />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <CountryChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 12 }}>
          <TimelineChart />
        </Grid>
      </Grid>

      <RecentLogsTable />
    </Box>
  );
}