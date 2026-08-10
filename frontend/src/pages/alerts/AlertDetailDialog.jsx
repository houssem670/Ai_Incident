import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Chip, Stack, List, ListItem, ListItemText
} from "@mui/material";

export default function AlertDetailDialog({ alert, open, onClose }) {
    if (!alert) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{alert.alert_title}</DialogTitle>
            <DialogContent dividers>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip label={alert.risk_level} color="error" />
                    <Chip label={`Confidence: ${alert.confidence}`} variant="outlined" />
                    <Chip label={alert.attack_type} variant="outlined" />
                </Stack>

                <Typography variant="subtitle2" color="text.secondary">Source IP</Typography>
                <Typography sx={{ mb: 2 }}>{alert.source_ip}</Typography>

                <Typography variant="subtitle2" color="text.secondary">Affected Asset</Typography>
                <Typography sx={{ mb: 2 }}>{alert.affected_asset}</Typography>

                <Typography variant="subtitle2" color="text.secondary">Executive Summary</Typography>
                <Typography sx={{ mb: 2 }}>{alert.executive_summary}</Typography>

                <Typography variant="subtitle2" color="text.secondary">Business Impact</Typography>
                <Typography sx={{ mb: 2 }}>{alert.business_impact}</Typography>

                <Typography variant="subtitle2" color="text.secondary">IOC Detected</Typography>
                <List dense>
                    {(alert.ioc_detected || []).map((ioc, i) => (
                        <ListItem key={i}><ListItemText primary={ioc} /></ListItem>
                    ))}
                </List>

                <Typography variant="subtitle2" color="text.secondary">Recommended Actions</Typography>
                <List dense>
                    {(alert.recommended_actions || []).map((action, i) => (
                        <ListItem key={i}><ListItemText primary={action} /></ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}