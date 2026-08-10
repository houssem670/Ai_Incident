import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Chip,
  Button,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
  const sessionUser = JSON.parse(localStorage.getItem("soc_user") || "{}")
  const initials = (sessionUser.username || "A").slice(0, 1).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("soc_token");
    localStorage.removeItem("soc_user");
    window.location.href = "/login";
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "rgba(7, 15, 31, 0.9)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(148, 163, 184, 0.16)",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            SOC Command Center
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Enterprise cyber defense operations
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Chip label="LIVE" color="success" size="small" sx={{ mr: 1 }} />
        <Chip label={(sessionUser.role || "Analyst").toUpperCase()} color="primary" size="small" sx={{ mr: 1 }} />

        <IconButton color="inherit" aria-label="notifications">
          <Badge badgeContent={5} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Avatar sx={{ ml: 1, bgcolor: "#2563eb" }}>{initials}</Avatar>

        <Button
          color="inherit"
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ ml: 1, borderColor: "rgba(255,255,255,0.2)" }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}