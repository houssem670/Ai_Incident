import { useEffect, useState } from "react";

import {
    Paper,
    Typography,
} from "@mui/material";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import { getCountries } from "../../services/dashboardService";

export default function CountryChart() {
    const [data, setData] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getCountries();
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
                Country Distribution
            </Typography>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Paper>
    );
}
