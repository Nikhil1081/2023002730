import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";

function getItemValue(item, keys, fallback = "-") {
  for (const key of keys) {
    if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") {
      return item[key];
    }
  }
  return fallback;
}

export default function NotificationCard({ item, viewed, onView, score }) {
  const id = getItemValue(item, ["ID", "id"]);
  const type = getItemValue(item, ["Type", "type"], "Unknown");
  const message = getItemValue(item, ["Message", "message"], "No message provided");
  const timestamp = getItemValue(item, ["Timestamp", "timestamp"], "-");

  return (
    <Card
      onClick={() => onView(id)}
      sx={{
        mb: 2,
        cursor: "pointer",
        borderLeft: viewed ? "6px solid #94a3b8" : "6px solid #1d4ed8",
        backgroundColor: viewed ? "#f8fafc" : "#ffffff",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={1}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {message}
          </Typography>

          <Stack direction="row" gap={1} flexWrap="wrap">
            <Chip label={type} color="primary" size="small" />
            {!viewed && <Chip label="New" color="success" size="small" />}
            {score !== undefined && <Chip label={`Score: ${score}`} color="secondary" size="small" />}
          </Stack>
        </Stack>

        <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
          ID: {id}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, color: "text.secondary" }}>
          Timestamp: {timestamp}
        </Typography>
      </CardContent>
    </Card>
  );
}
