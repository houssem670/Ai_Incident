import Chip from "@mui/material/Chip";

export default function SeverityChip({ severity }) {

  const colors = {
    Critical: "error",
    High: "warning",
    Medium: "info",
    Low: "success",
  };

  return (
    <Chip
      label={severity}
      color={colors[severity] || "default"}
      size="small"
    />
  );
}