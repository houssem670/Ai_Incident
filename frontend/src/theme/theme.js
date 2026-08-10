import { createTheme } from "@mui/material/styles";

const theme = createTheme({

    palette: {

        mode: "dark",

        primary: {
            main: "#1976d2",
        },

        secondary: {
            main: "#00bcd4",
        },

        success: {
            main: "#2e7d32",
        },

        warning: {
            main: "#ed6c02",
        },

        error: {
            main: "#d32f2f",
        },

        background: {
            default: "#0f172a",
            paper: "#1e293b",
        },

        text: {
            primary: "#ffffff",
            secondary: "#94a3b8",
        },

    },

    typography: {

        fontFamily: "Inter, Roboto, Arial, sans-serif",

        h4: {
            fontWeight: 700,
        },

        h5: {
            fontWeight: 600,
        },

        h6: {
            fontWeight: 600,
        },

        button: {
            textTransform: "none",
            fontWeight: 600,
        },

    },

    shape: {
        borderRadius: 12,
    },

    components: {

        MuiPaper: {

            styleOverrides: {

                root: {

                    backgroundColor: "#1e293b",

                    border: "1px solid rgba(255,255,255,0.05)",

                    boxShadow: "0 4px 20px rgba(0,0,0,0.35)",

                },

            },

        },

        MuiCard: {

            styleOverrides: {

                root: {

                    borderRadius: 16,

                    transition: "0.3s",

                    "&:hover": {

                        transform: "translateY(-4px)",

                        boxShadow: "0 8px 30px rgba(25,118,210,0.25)",

                    },

                },

            },

        },

        MuiButton: {

            styleOverrides: {

                root: {

                    borderRadius: 10,

                    padding: "8px 18px",

                },

            },

        },

    },

});

export default theme;