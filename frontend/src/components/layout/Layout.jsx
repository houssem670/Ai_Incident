import { Box, Toolbar } from "@mui/material";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#081121" }}>
      <Navbar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          minHeight: "100vh",
          bgcolor: "linear-gradient(180deg, #081121 0%, #0f172a 100%)",
          backgroundImage:
            "radial-gradient(circle at top left, rgba(37,99,235,0.28), transparent 24%), radial-gradient(circle at top right, rgba(6,182,212,0.18), transparent 22%)",
        }}
      >
        <Toolbar />
        <Box sx={{ maxWidth: 1500, mx: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}