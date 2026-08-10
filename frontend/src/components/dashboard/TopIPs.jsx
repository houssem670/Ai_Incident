import { useEffect, useState } from "react";

import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Chip,
} from "@mui/material";

import { getTopIPs } from "../../services/dashboardService";

export default function TopIPs() {
    const [ips, setIps] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getTopIPs();
                setIps(result);
            } catch (err) {
                console.error(err);
            }
        }

        loadData();
    }, []);

    return (
        <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
                Top Source IPs
            </Typography>

            <List>
                {ips.map((ip, index) => (
                    <div key={ip.ip}>
                        <ListItem>
                            <ListItemText
                                primary={ip.ip}
                                secondary={`${ip.count} logs`}
                            />
                            <Chip label={index + 1} color="error" size="small" />
                        </ListItem>
                        {index < ips.length - 1 && <Divider />}
                    </div>
                ))}
            </List>
        </Paper>
    );
}