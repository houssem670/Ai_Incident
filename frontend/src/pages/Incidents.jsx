import { useEffect, useState } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

import IncidentToolbar from "../components/incidents/IncidentToolbar";
import IncidentTable from "../components/incidents/IncidentTable";

import {
    getIncidents,
    updateIncidentStatus,
    deleteIncident,
} from "../services/incidentsService";

export default function Incidents() {

    const navigate = useNavigate();

    const [incidents, setIncidents] = useState([]);

    const [search, setSearch] = useState("");

    const [severity, setSeverity] = useState("");

    const [status, setStatus] = useState("");

    const [error, setError] = useState("");

    const loadIncidents = async () => {

        try {

            const data = await getIncidents();

            console.log("Incidents API :", data);

            setIncidents(data);

        } catch (err) {

            console.error(err);

        }

    };

    useEffect(() => {

        loadIncidents();

    }, []);

    const handleView = (incident) => {

        navigate(`/incidents/${incident.id}`);

    };

    const handleEdit = async (incident) => {

        const newStatus = window.prompt(
            "New status (Open, Investigating, Resolved, Closed):",
            incident.status
        );

        if (!newStatus || newStatus === incident.status) return;

        try {
            setError("");
            await updateIncidentStatus(incident.id, newStatus);
            loadIncidents();
        } catch (err) {
            setError(err?.response?.data?.detail || "Unable to update incident.");
        }

    };

    const handleDelete = async (incident) => {

        if (!window.confirm(`Delete incident #${incident.id}?`)) return;

        try {
            setError("");
            await deleteIncident(incident.id);
            loadIncidents();
        } catch (err) {
            setError(err?.response?.data?.detail || "Unable to delete incident.");
        }

    };

    return (

        <Box>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Security Incidents
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <IncidentToolbar
                search={search}
                setSearch={setSearch}
                severity={severity}
                setSeverity={setSeverity}
                status={status}
                setStatus={setStatus}
                onRefresh={loadIncidents}
            />

            <IncidentTable
                rows={incidents}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

        </Box>

    );

}