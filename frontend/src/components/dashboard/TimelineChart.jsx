import { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import { getTimeline } from "../../services/dashboardService";

export default function TimelineChart() {
    const [data, setData] = useState([]);
    const [range, setRange] = useState("24h");

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getTimeline(range);
                setData(result);
            } catch (err) {
                console.error(err);
            }
        }

        loadData();
    }, [range]);

    return (
        <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 3, height: 460 }}>
            <Typography variant="h6" gutterBottom>
                Logs Evolution
            </Typography>

            <ToggleButtonGroup
                color="primary"
                value={range}
                exclusive
                onChange={(event, next) => next && setRange(next)}
                sx={{ mb: 2 }}
            >
                <ToggleButton value="24h">24H</ToggleButton>
                <ToggleButton value="7d">7D</ToggleButton>
                <ToggleButton value="30d">30D</ToggleButton>
            </ToggleButtonGroup>

            <ResponsiveContainer width="100%" height={330}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
}