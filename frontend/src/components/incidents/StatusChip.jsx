import Chip from "@mui/material/Chip";

export default function StatusChip({ status }) {

  const colors = {
    Open: "error",
    Investigating: "warning",
    Resolved: "success",
    Closed: "default",
  };

  return (
    <Chip
      label={status}
      color={colors[status] || "default"}
      size="small"
    />
  );
}