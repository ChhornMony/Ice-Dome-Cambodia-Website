"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Bell, CheckCheck } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/announcements/my-notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Failed to load notifications");
        return;
      }

      setNotifications(result.data.notifications || []);
    } catch (error) {
      console.error("FETCH NOTIFICATIONS ERROR:", error);
      setMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/announcements/mark-all-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Failed to mark notifications as read");
        return;
      }

      await fetchNotifications();
    } catch (error) {
      console.error("MARK ALL READ ERROR:", error);
      setMessage("Cannot connect to backend server.");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <DashboardLayout
      title="Notifications"
      subtitle="View booking updates and Ice Dome announcements."
    >
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center">
              <Bell size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                Latest Notifications
              </h2>
              <p className="text-gray-500 mt-1">
                Announcements from Ice Dome Cambodia will appear here.
              </p>
            </div>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 px-5 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition"
            >
              <CheckCheck size={18} />
              Mark all read
            </button>
          )}
        </div>

        {message && (
          <div className="mb-5 rounded-2xl bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 font-medium">
            Loading notifications...
          </p>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 p-8 text-center">
            <Bell size={60} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-extrabold text-gray-900">
              No notifications yet
            </h3>
            <p className="text-gray-500 mt-2">
              Admin announcements and booking updates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 ${
                  item.isRead
                    ? "border-gray-100 bg-gray-50"
                    : "border-blue-100 bg-blue-50"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-extrabold text-gray-900">
                        {item.title}
                      </h3>

                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-bold">
                        {item.type}
                      </span>
                    </div>

                    <p className="text-gray-600 leading-relaxed">
                      {item.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-3">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {!item.isRead && (
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">
                      New
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}