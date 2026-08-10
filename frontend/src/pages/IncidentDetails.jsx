import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Paper,
    Typography,
    Grid,
    Divider,
    Chip,
    CircularProgress,
    Box,
    Stack,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

import {
    getIncident,
    updateIncidentStatus,
    assignIncident
} from "../services/incidentsService";

export default function IncidentDetails() {

    const { id } = useParams();

    const [incident, setIncident] = useState(null);

    useEffect(() => {
        loadIncident();
    }, []);

    async function loadIncident() {

        try {

            const data = await getIncident(id);

            setIncident(data);

        } catch (err) {

            console.error(err);

        }

    }

    async function changeStatus(status) {

        try {

            const updated = await updateIncidentStatus(
                incident.id,
                status
            );

            setIncident(updated);

        } catch (err) {

            console.error(err);

        }

    }

    async function changeAssignedTo(user) {

        try {

            const updated = await assignIncident(
                incident.id,
                user
            );

            setIncident(updated);

        } catch (err) {

            console.error(err);

        }

    }

    if (!incident) {

        return (

            <Box
                display="flex"
                justifyContent="center"
                mt={5}
            >

                <CircularProgress />

            </Box>

        );

    }

    return (

        <Paper
            elevation={3}
            sx={{
                p: 4
            }}
        >

            <Typography
                variant="h4"
                gutterBottom
            >
                Incident #{incident.id}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>

                <Grid item xs={12} md={6}>

                    <Typography>
                        <strong>Title :</strong> {incident.title}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Source IP :</strong> {incident.source_ip}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Country :</strong> {incident.country}
                    </Typography>

                    <Typography sx={{ mt: 2 }}>
                        <strong>Risk Score :</strong> {incident.risk_score}
                    </Typography>

                </Grid>

                <Grid item xs={12} md={6}>

                    <Typography sx={{ mb: 2 }}>
                        <strong>Severity :</strong>
                    </Typography>

                    <Chip
                        label={incident.severity}
                        color={
                            incident.severity === "Critical"
                                ? "error"
                                : incident.severity === "High"
                                ? "warning"
                                : incident.severity === "Medium"
                                ? "info"
                                : "success"
                        }
                    />

                    <Typography sx={{ mt: 3 }}>
                        <strong>Status :</strong>
                    </Typography>

                    <Chip
                        label={incident.status}
                        color="primary"
                    />

                    <Typography sx={{ mt: 3 }}>
                        <strong>Assigned To :</strong>
                    </Typography>

                    <FormControl
                        fullWidth
                        sx={{ mt: 2 }}
                    >

                        <InputLabel>
                            Analyst
                        </InputLabel>

                        <Select
                            value={incident.assigned_to || ""}
                            label="Analyst"
                            onChange={(e) =>
                                changeAssignedTo(e.target.value)
                            }
                        >

                            <MenuItem value="Ahmed">
                                Ahmed
                            </MenuItem>

                            <MenuItem value="Fatma">
                                Fatma
                            </MenuItem>

                            <MenuItem value="Mohamed">
                                Mohamed
                            </MenuItem>

                            <MenuItem value="SOC Team">
                                SOC Team
                            </MenuItem>

                        </Select>

                    </FormControl>

                </Grid>

            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography
                variant="h6"
                gutterBottom
            >
                Description
            </Typography>

            <Typography>
                {incident.description}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography
                variant="h6"
                gutterBottom
            >
                AI Analysis (Ollama)
            </Typography>

            <Typography>
                {incident.ai_analysis}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography
                variant="h6"
                gutterBottom
            >
                Incident Response
            </Typography>

            <Stack
                direction="row"
                spacing={2}
                mt={2}
            >

                <Button
                    variant="contained"
                    color="warning"
                    onClick={() =>
                        changeStatus("Investigating")
                    }
                >
                    Investigating
                </Button>

                <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                        changeStatus("Resolved")
                    }
                >
                    Resolved
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                        changeStatus("Closed")
                    }
                >
                    Closed
                </Button>

            </Stack>

        </Paper>

    );

}