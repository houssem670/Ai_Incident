import {
    Paper,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

export default function IncidentToolbar({

    search,
    setSearch,

    severity,
    setSeverity,

    status,
    setStatus,

    onRefresh,

}) {

    return (

        <Paper
            elevation={3}
            sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
            }}
        >

            <Grid
                container
                spacing={2}
                alignItems="center"
            >

                <Grid size={{ xs: 12, md: 5 }}>

                    <TextField
                        fullWidth
                        label="Search Incident"
                        placeholder="Search by IP, ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>

                    <FormControl fullWidth>

                        <InputLabel>
                            Severity
                        </InputLabel>

                        <Select
                            value={severity}
                            label="Severity"
                            onChange={(e) => setSeverity(e.target.value)}
                        >

                            <MenuItem value="">
                                All
                            </MenuItem>

                            <MenuItem value="Critical">
                                Critical
                            </MenuItem>

                            <MenuItem value="High">
                                High
                            </MenuItem>

                            <MenuItem value="Medium">
                                Medium
                            </MenuItem>

                            <MenuItem value="Low">
                                Low
                            </MenuItem>

                        </Select>

                    </FormControl>

                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>

                    <FormControl fullWidth>

                        <InputLabel>
                            Status
                        </InputLabel>

                        <Select
                            value={status}
                            label="Status"
                            onChange={(e) => setStatus(e.target.value)}
                        >

                            <MenuItem value="">
                                All
                            </MenuItem>

                            <MenuItem value="Open">
                                Open
                            </MenuItem>

                            <MenuItem value="Investigating">
                                Investigating
                            </MenuItem>

                            <MenuItem value="Resolved">
                                Resolved
                            </MenuItem>

                            <MenuItem value="Closed">
                                Closed
                            </MenuItem>

                        </Select>

                    </FormControl>

                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>

                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={onRefresh}
                        sx={{
                            height: 56,
                        }}
                    >
                        Refresh
                    </Button>

                </Grid>

            </Grid>

        </Paper>

    );

}