import { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Pagination, Stack, Typography, CircularProgress, Alert } from "@mui/material";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import NotificationCard from "../components/NotificationCard";
import { fetchNotifications } from "../services/api";

export default function HomePage() {
  const [notifications, setNotifications] = useState([]);
  const [type, setType] = useState("All");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
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
        const result = await fetchNotifications(page, limit, type);

        if (!active) return;

        setNotifications(result.notifications);
        setHasMore(result.notifications.length === limit);
        setSource(result.source);
      } catch (err) {
        if (active) setError("Failed to fetch notifications");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [page, type, limit]);

  const viewedSet = useMemo(() => new Set(viewedIds), [viewedIds]);

  const handleView = (id) => {
    if (!viewedSet.has(id)) {
      setViewedIds((current) => [...current, id]);
    }
  };

  const handlePageChange = (_, value) => setPage(value);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 2 }}>
            Stage 2
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
            All Notifications
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
            Browse the latest notifications with basic filtering and pagination.
          </Typography>
          {source === "fallback" && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Showing sample notifications because the protected API could not be reached.
            </Alert>
          )}
        </Box>

        <FilterBar type={type} setType={(value) => { setType(value); setPage(1); }} />

        {loading && (
          <Stack alignItems="center" sx={{ py: 6 }}>
            <CircularProgress />
          </Stack>
        )}

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {!loading && !error && notifications.length === 0 && (
          <Alert severity="info">No notifications found.</Alert>
        )}

        {!loading && notifications.map((item) => {
          const id = item.ID ?? item.id;
          return (
            <NotificationCard
              key={id}
              item={item}
              viewed={viewedSet.has(id)}
              onView={handleView}
            />
          );
        })}

        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
          <Pagination
            count={hasMore ? page + 1 : page}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Stack>

        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, flexWrap: "wrap", gap: 2 }}>
          <Button variant="outlined" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
            Previous
          </Button>
          <Button variant="contained" disabled={!hasMore} onClick={() => setPage((current) => current + 1)}>
            Next
          </Button>
        </Stack>
      </Container>
    </>
  );
}
