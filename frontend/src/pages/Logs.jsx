import { Box, Typography } from "@mui/material";
import LogsExplorer from "../components/logs/LogsExplorer";

export default function Logs() {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Logs Explorer
      </Typography>

      <Typography variant="body1" color="text.secondary" mb={3}>
        Search, filter and investigate security events stored in PostgreSQL.
      </Typography>

      <LogsExplorer />
    </Box>
  );
}