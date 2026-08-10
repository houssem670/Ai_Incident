import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import {
  getSettings,
  updateSettings,
  purgeOldLogs,
  getInternalApiKey,
} from "../services/settingsService";

const SEVERITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [platformName, setPlatformName] = useState("");
  const [severityThreshold, setSeverityThreshold] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [retentionDays, setRetentionDays] = useState(90);

  const [apiKey, setApiKey] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [purgeResult, setPurgeResult] = useState(null);

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("soc_user"));
    } catch {
      return null;
    }
  })();

  const isAdmin = currentUser?.role === "admin";

  const loadSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
      setPlatformName(data.platform_name);
      setSeverityThreshold(data.incident_severity_threshold);
      setNotificationsEnabled(data.notifications_enabled);
      setRetentionDays(data.log_retention_days);
    } catch (err) {
      setError("Unable to load settings.");
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const toggleSeverity = (level) => {
    setSeverityThreshold((prev) =>
      prev.includes(level)
        ? prev.filter((s) => s !== level)
        : [...prev, level]
    );
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    try {
      await updateSettings({
        platform_name: platformName,
        incident_severity_threshold: severityThreshold,
        notifications_enabled: notificationsEnabled,
        log_retention_days: Number(retentionDays),
      });

      setSuccess("Settings saved successfully.");
      loadSettings();
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to save settings.");
    }
  };

  const handlePurge = async () => {
    if (!window.confirm(`Delete all logs older than ${retentionDays} days?`)) return;

    try {
      setError("");
      const result = await purgeOldLogs();
      setPurgeResult(result.deleted);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to purge logs.");
    }
  };

  const handleShowApiKey = async () => {
    if (apiKey) {
      setShowApiKey((prev) => !prev);
      return;
    }

    try {
      const data = await getInternalApiKey();
      setApiKey(data);
      setShowApiKey(true);
    } catch (err) {
      setError(err?.response?.data?.detail || "Unable to load API key.");
    }
  };

  const handleCopyApiKey = () => {
    if (apiKey?.full) {
      navigator.clipboard.writeText(apiKey.full);
      setSuccess("API key copied to clipboard.");
    }
  };

  if (!settings) {
    return <Typography>Loading settings...</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Platform Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure incident detection, notifications, and data retention.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {!isAdmin && (
        <Alert severity="info">
          You are viewing settings in read-only mode. Only administrators can make changes.
        </Alert>
      )}

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          General
        </Typography>

        <TextField
          fullWidth
          label="Platform Name"
          value={platformName}
          onChange={(e) => setPlatformName(e.target.value)}
          disabled={!isAdmin}
          sx={{ mt: 2 }}
        />
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Incident Detection
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Automatic incidents are created only for the severity levels selected below.
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          {SEVERITY_OPTIONS.map((level) => (
            <Chip
              key={level}
              label={level}
              clickable={isAdmin}
              color={severityThreshold.includes(level) ? "primary" : "default"}
              variant={severityThreshold.includes(level) ? "filled" : "outlined"}
              onClick={() => isAdmin && toggleSeverity(level)}
            />
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              disabled={!isAdmin}
            />
          }
          label={notificationsEnabled ? "Notifications enabled" : "Notifications disabled"}
        />
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Log Retention
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <TextField
            type="number"
            label="Retention (days)"
            value={retentionDays}
            onChange={(e) => setRetentionDays(e.target.value)}
            disabled={!isAdmin}
            sx={{ maxWidth: 200 }}
          />

          {isAdmin && (
            <Button variant="outlined" color="warning" onClick={handlePurge}>
              Purge Old Logs Now
            </Button>
          )}
        </Stack>

        {purgeResult !== null && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {purgeResult} log(s) deleted.
          </Alert>
        )}
      </Paper>

      {isAdmin && (
        <Paper sx={{ p: 3, borderRadius: 3 }}>
          <Typography variant="h6" gutterBottom>
            Internal API Key (n8n integration)
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Used by n8n to authenticate automated incident creation.
          </Typography>

          <TextField
            fullWidth
            sx={{ mt: 2 }}
            value={
              apiKey
                ? showApiKey
                  ? apiKey.full
                  : apiKey.masked
                : "••••••••••••••••••••••••"
            }
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowApiKey}>
                    {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                  <IconButton onClick={handleCopyApiKey} disabled={!apiKey}>
                    <ContentCopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      )}

      {isAdmin && (
        <Box display="flex" justifyContent="flex-end">
          <Button variant="contained" size="large" onClick={handleSave}>
            Save Settings
          </Button>
        </Box>
      )}
    </Stack>
  );
}