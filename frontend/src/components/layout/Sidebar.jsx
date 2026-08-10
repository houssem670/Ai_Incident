import {
    Drawer,
    Toolbar,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import WarningIcon from "@mui/icons-material/Warning";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 260;


// =====================================================
// Main navigation items
// =====================================================

const baseItems = [
    {
        label: "Dashboard",
        path: "/",
        icon: <DashboardIcon />,
    },
    {
        label: "Logs",
        path: "/logs",
        icon: <DescriptionIcon />,
    },
    {
        label: "Incidents",
        path: "/incidents",
        icon: <WarningIcon />,
    },
    {
        label: "Alerts",
        path: "/alerts",
        icon: <NotificationsActiveIcon />,
    },
    {
        label: "Reports",
        path: "/reports",
        icon: <DescriptionIcon />,
    },
    {
        label: "Settings",
        path: "/settings",
        icon: <SettingsIcon />,
    },
];


// =====================================================
// Admin navigation item
// =====================================================

const adminItem = {
    label: "User Management",
    path: "/users",
    icon: <GroupIcon />,
};


export default function Sidebar() {

    const location = useLocation();


    // =================================================
    // Get current user
    // =================================================

    let currentUser = null;

    try {

        currentUser = JSON.parse(
            localStorage.getItem("soc_user")
        );

    } catch {

        currentUser = null;

    }


    // =================================================
    // Check admin role
    // =================================================

    const isAdmin =
        currentUser?.role === "admin";


    // =================================================
    // Navigation according to role
    // =================================================

    const items = isAdmin
        ? [...baseItems, adminItem]
        : baseItems;


    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,

                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",

                    background:
                        "linear-gradient(180deg, #0b1221 0%, #111827 100%)",

                    borderRight:
                        "1px solid rgba(148, 163, 184, 0.16)",

                    color: "#e5eefc",
                },
            }}
        >

            {/* =================================================
                Navigation title
            ================================================= */}

            <Toolbar />

            <Box
                sx={{
                    px: 2,
                    py: 2,
                }}
            >

                <Typography
                    variant="overline"
                    color="text.secondary"
                >
                    Navigation
                </Typography>

            </Box>


            {/* =================================================
                Navigation items
            ================================================= */}

            <List sx={{ px: 1 }}>

                {items.map((item) => {

                    const isActive =
                        location.pathname === item.path;


                    return (

                        <ListItemButton
                            key={item.label}
                            component={Link}
                            to={item.path}
                            selected={isActive}

                            sx={{
                                borderRadius: 2,
                                mb: 0.5,

                                color: isActive
                                    ? "#ffffff"
                                    : "#cbd5e1",

                                background: isActive
                                    ? "linear-gradient(90deg, rgba(37,99,235,0.45), rgba(6,182,212,0.28))"
                                    : "transparent",

                                "&:hover": {
                                    background:
                                        "rgba(37, 99, 235, 0.2)",
                                },
                            }}
                        >

                            <ListItemIcon
                                sx={{
                                    minWidth: 40,

                                    color: isActive
                                        ? "#fff"
                                        : "#93c5fd",
                                }}
                            >

                                {item.icon}

                            </ListItemIcon>


                            <ListItemText
                                primary={item.label}
                            />

                        </ListItemButton>

                    );

                })}

            </List>


            {/* =================================================
                Separator
            ================================================= */}

            <Divider
                sx={{
                    mx: 2,
                    my: 2,
                    borderColor:
                        "rgba(255,255,255,0.08)",
                }}
            />


            {/* =================================================
                Security status
            ================================================= */}

            <Box
                sx={{
                    px: 2,
                    py: 1,
                }}
            >

                <Typography
                    variant="caption"
                    color="text.secondary"
                >
                    Security posture: Hardened
                </Typography>

            </Box>

        </Drawer>

    );
}