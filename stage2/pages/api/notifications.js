import axios from "axios";

const BASE_URL =
  process.env.NOTIFICATION_API_URL ||
  "http://4.224.186.213/evaluation-service/notifications";
const ACCESS_TOKEN =
  process.env.NOTIFICATION_API_TOKEN || process.env.NEXT_PUBLIC_NOTIFICATION_API_TOKEN || "";

const fallbackNotifications = [
  { ID: 1, Type: "Placement", Message: "Google hiring drive", Timestamp: "2026-06-07T09:10:00Z" },
  { ID: 2, Type: "Result", Message: "Mid sem result published", Timestamp: "2026-06-07T08:50:00Z" },
  { ID: 3, Type: "Event", Message: "Tech fest registrations open", Timestamp: "2026-06-07T09:20:00Z" },
  { ID: 4, Type: "Placement", Message: "Amazon shortlist released", Timestamp: "2026-06-07T07:55:00Z" },
  { ID: 5, Type: "Event", Message: "Workshop on AI", Timestamp: "2026-06-07T07:20:00Z" },
  { ID: 6, Type: "Result", Message: "Project review result", Timestamp: "2026-06-07T09:05:00Z" },
  { ID: 7, Type: "Placement", Message: "Microsoft internship open", Timestamp: "2026-06-07T09:00:00Z" },
  { ID: 8, Type: "Event", Message: "Club meeting today", Timestamp: "2026-06-07T08:45:00Z" },
  { ID: 9, Type: "Result", Message: "External exam result", Timestamp: "2026-06-07T08:30:00Z" },
  { ID: 10, Type: "Placement", Message: "Infosys final round", Timestamp: "2026-06-07T09:25:00Z" },
];

function normalizeItem(item, index) {
  return {
    ID: item.ID ?? item.id ?? index + 1,
    Type: item.Type ?? item.type ?? "Unknown",
    Message: item.Message ?? item.message ?? "No message",
    Timestamp: item.Timestamp ?? item.timestamp ?? new Date().toISOString(),
  };
}

function filterItems(items, type) {
  if (!type || type === "All") return items;
  return items.filter((item) => item.Type === type);
}

function paginateItems(items, page, limit) {
  const start = (page - 1) * limit;
  return items.slice(start, start + limit);
}

export default async function handler(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 10));
  const type = req.query.notification_type || "All";

  try {
    const headers = { Accept: "application/json" };

    if (ACCESS_TOKEN) {
      headers.Authorization = `Bearer ${ACCESS_TOKEN}`;
    }

    const response = await axios.get(BASE_URL, {
      params: { page, limit, notification_type: type },
      headers,
    });

    const data = response.data;
    const rawItems = Array.isArray(data?.notifications)
      ? data.notifications
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

    const notifications = rawItems.map(normalizeItem);
    return res.status(200).json({ notifications, source: "api" });
  } catch (error) {
    const notifications = paginateItems(filterItems(fallbackNotifications, type), page, limit);
    return res.status(200).json({
      notifications,
      source: "fallback",
      message: "Using local sample notifications because the protected API could not be reached.",
    });
  }
}
