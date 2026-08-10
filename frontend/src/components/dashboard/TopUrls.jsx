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

import { getTopUrls } from "../../services/dashboardService";

export default function TopUrls() {
    const [urls, setUrls] = useState([]);

    useEffect(() => {
        async function loadData() {
            try {
                const result = await getTopUrls();
                setUrls(result);
            } catch (err) {
                console.error(err);
            }
        }

        loadData();
    }, []);

    return (
        <Paper elevation={3} sx={{ mt: 3, p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
                Top Target URLs
            </Typography>

            <List>
                {urls.map((item, index) => (
                    <div key={item.url}>
                        <ListItem>
                            <ListItemText
                                primary={item.url}
                                secondary={`${item.count} requests`}
                            />
                            <Chip label={index + 1} color="primary" size="small" />
                        </ListItem>
                        {index < urls.length - 1 && <Divider />}
                    </div>
                ))}
            </List>
        </Paper>
    );
}
