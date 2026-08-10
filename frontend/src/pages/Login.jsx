import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, Card, CardContent, TextField, Typography,
  Alert, Stack, InputAdornment, Chip,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";

import { login } from "../services/authService";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [platformName, setPlatformName] = useState("SOC Command Center");

  useEffect(() => {
    api.get("/api/settings/public")
      .then((res) => {
        if (res.data?.platform_name) {
          setPlatformName(res.data.platform_name);
        }
      })
      .catch(() => {
        // en cas d'erreur, on garde le nom par défaut, silencieusement
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(username, password);
      localStorage.setItem("soc_token", response.access_token);
      localStorage.setItem("soc_user", JSON.stringify(response.user));
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.detail || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", bgcolor: "#06101f", px: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 460, borderRadius: 4, bgcolor: "#0b172b" }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                {platformName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Secure access for incident analysts and responders.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Chip label="Admin" color="error" variant="outlined" />
              <Chip label="Analyst" color="primary" variant="outlined" />
              <Chip label="Manager" color="success" variant="outlined" />
            </Stack>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"><PersonIcon /></InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start"><LockIcon /></InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" variant="contained" size="large" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}