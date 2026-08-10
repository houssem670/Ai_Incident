import { useEffect, useState } from "react";

import { Paper, Typography } from "@mui/material";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import { getSeverity } from "../../services/dashboardService";

const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
];

export default function SeverityChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getSeverity();
                setData(result);
            } catch (err) {
                console.error(err);
            }
        }

        loadData();
    }, []);

    return (
        <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 3, height: 420 }}>
            <Typography variant="h6" gutterBottom>
                Severity Distribution
            </Typography>

            <ResponsiveContainer width="100%" height={330}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="count"
                        nameKey="severity"
                        outerRadius={120}
                        label
                    >
                        {data.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
}