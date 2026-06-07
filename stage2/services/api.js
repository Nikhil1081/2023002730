import axios from "axios";

const BASE_URL = "/api/notifications";

export async function fetchNotifications(page = 1, limit = 10, type = "All") {
  const params = { page, limit };

  if (type && type !== "All") {
    params.notification_type = type;
  }

  const response = await axios.get(BASE_URL, { params });
  const data = response.data;

  if (Array.isArray(data?.notifications)) return { notifications: data.notifications, source: data.source || "api" };
  if (Array.isArray(data?.data)) return { notifications: data.data, source: data.source || "api" };
  if (Array.isArray(data)) return { notifications: data, source: data.source || "api" };
  return { notifications: [], source: data?.source || "api" };
}
