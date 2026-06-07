import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, CircularProgress, Container, Stack, TextField, Typography } from "@mui/material";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import NotificationCard from "../components/NotificationCard";
import { fetchNotifications } from "../services/api";

const typeWeight = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getPriorityScore(item) {
  const type = item.Type ?? item.type ?? "";
  const timestamp = item.Timestamp ?? item.timestamp ?? Date.now();
  const timeValue = new Date(timestamp);
  const validTime = Number.isNaN(timeValue.getTime()) ? new Date() : timeValue;
  const diffMinutes = Math.max(0, Math.floor((Date.now() - validTime.getTime()) / 60000));
  const recencyScore = Math.max(0, 1000 - diffMinutes);

  return (typeWeight[type] || 0) * 100 + recencyScore;
}

export default function PriorityPage() {
  const [notifications, setNotifications] = useState([]);
  const [type, setType] = useState("All");
  const [page, setPage] = useState(1);
  const [topN, setTopN] = useState(10);
  const [viewedIds, setViewedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const result = await fetchNotifications(page, 20, type);

        if (!active) return;

        const scored = result.notifications.map((item) => ({
          ...item,
          score: getPriorityScore(item),
        }));

        scored.sort((a, b) => b.score - a.score);
        setNotifications(scored.slice(0, topN));
        setSource(result.source);
      } catch (err) {
        if (active) setError("Failed to fetch priority notifications");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [page, type, topN]);

  const viewedSet = useMemo(() => new Set(viewedIds), [viewedIds]);

  const handleView = (id) => {
    if (!viewedSet.has(id)) {
      setViewedIds((current) => [...current, id]);
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ color: "secondary.main", letterSpacing: 2 }}>
            Priority View
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            Priority Notifications
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
            Sorted by notification type and recency.
          </Typography>
          {source === "fallback" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Showing sample notifications because the protected API could not be reached.
            </Alert>
          )}
        </Box>

        <FilterBar type={type} setType={(value) => { setType(value); setPage(1); }} />

        <TextField
          label="Top N"
          type="number"
          value={topN}
          onChange={(event) => setTopN(Math.max(1, Number(event.target.value) || 1))}
          inputProps={{ min: 1, max: 20 }}
          sx={{ mb: 3, maxWidth: 180 }}
        />

        {loading && (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && !error && notifications.length === 0 && (
          <Alert severity="info">No priority notifications found.</Alert>
        )}

        {!loading && notifications.map((item) => {
          const id = item.ID ?? item.id;
          return (
            <NotificationCard
              key={id}
              item={item}
              viewed={viewedSet.has(id)}
              onView={handleView}
              score={item.score}
            />
          );
        })}

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 3, flexWrap: "wrap", gap: 2 }}>
          <Button variant="outlined" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
            Previous
          </Button>
          <Button variant="contained" onClick={() => setPage((current) => current + 1)}>
            Next
          </Button>
        </Stack>
      </Container>
    </>
  );
}
