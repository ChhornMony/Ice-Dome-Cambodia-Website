const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const cleanUrl = RAW_API_URL.replace(/\/+$/, "");

const API_BASE_URL = cleanUrl.endsWith("/api")
  ? cleanUrl
  : `${cleanUrl}/api`;

const getToken = () => {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
};

export async function apiRequest(path, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export const api = {
  health: () => apiRequest("/health"),
  getTickets: () => apiRequest("/tickets"),
  getProducts: () => apiRequest("/products"),

  createBooking: (booking) =>
    apiRequest("/bookings", {
      method: "POST",
      body: JSON.stringify(booking),
    }),

  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
};