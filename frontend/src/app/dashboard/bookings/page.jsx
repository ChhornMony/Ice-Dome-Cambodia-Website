"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  CalendarCheck,
  Clock,
  CreditCard,
  Loader2,
  Ticket,
  Receipt,
} from "lucide-react";

const getApiBaseUrl = () => {
  const rawUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const cleanUrl = rawUrl.replace(/\/+$/, "");

  if (!cleanUrl || cleanUrl === "/api") {
    return "http://localhost:5000/api";
  }

  if (cleanUrl.endsWith("/api")) {
    return cleanUrl;
  }

  return `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your bookings.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch bookings");
        }

        setBookings(data.data?.bookings || []);
      } catch (err) {
        console.error("FETCH BOOKINGS ERROR:", err);
        setError(err.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    if (status === "CONFIRMED") {
      return "bg-green-50 text-green-700 border-green-100";
    }

    if (status === "CANCELLED") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    return "bg-yellow-50 text-yellow-700 border-yellow-100";
  };

  const getPaymentClass = (status) => {
    if (status === "PAID") {
      return "bg-blue-50 text-blue-700 border-blue-100";
    }

    if (status === "FAILED" || status === "REFUNDED") {
      return "bg-red-50 text-red-700 border-red-100";
    }

    return "bg-gray-50 text-gray-700 border-gray-100";
  };

  return (
    <DashboardLayout
      title="My Bookings"
      subtitle="View and manage your skating bookings."
    >
      {loading && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex items-center gap-3">
          <Loader2 className="animate-spin text-blue-900" size={24} />
          <p className="font-bold text-gray-700">Loading bookings...</p>
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 rounded-3xl shadow-sm border border-red-100 p-8">
          <h2 className="text-xl font-extrabold text-red-700 mb-2">
            Failed to load bookings
          </h2>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center">
              <CalendarCheck size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                No bookings yet
              </h2>
              <p className="text-gray-500 mt-1">
                Your upcoming and past bookings will appear here.
              </p>
            </div>
          </div>

          <a
            href="/tickets"
            className="inline-block px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition"
          >
            Book Ticket
          </a>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const latestPayment =
              booking.latestPayment || booking.payments?.[0] || null;

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center shrink-0">
                      <Ticket size={28} />
                    </div>

                    <div>
                      <h2 className="text-xl font-extrabold text-gray-900">
                        {booking.ticket?.name || "Ice Skating Booking"}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Reference:{" "}
                        <span className="font-bold text-gray-800">
                          {booking.bookingReference || booking.id}
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CalendarCheck size={16} className="text-blue-700" />
                          <span>{formatDate(booking.visitDate)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-blue-700" />
                          <span>
                            Booked: {formatDateTime(booking.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CreditCard size={16} className="text-blue-700" />
                          <span>
                            Payment:{" "}
                            {latestPayment?.status || booking.paymentStatus}
                          </span>
                        </div>

                        {/* --- ADDED: Transaction ID (only shows once payment is matched/paid) --- */}
                        {latestPayment?.transactionId && (
                          <div className="flex items-center gap-2">
                            <Receipt size={16} className="text-blue-700" />
                            <span className="font-mono text-xs">
                              Trx: {latestPayment.transactionId}
                            </span>
                          </div>
                        )}
                        {/* ------------------------------------------------------------------------ */}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3">
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-extrabold ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-extrabold ${getPaymentClass(
                          booking.paymentStatus
                        )}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs text-gray-400 font-bold uppercase">
                        Total
                      </p>
                      <p className="text-2xl font-black text-gray-900">
                        ${Number(booking.totalPrice || 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Quantity: {booking.quantity || 1}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}