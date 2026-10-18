"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  ShoppingBag,
  CreditCard,
  Loader2,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

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

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Fetch ticket bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoadingBookings(false);
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
      } catch (error) {
        console.error("FETCH DASHBOARD BOOKINGS ERROR:", error);
        setBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, []);

  // Fetch shop orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoadingOrders(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(data.data?.orders || []);
      } catch (error) {
        console.error("FETCH DASHBOARD ORDERS ERROR:", error);
        setOrders([]);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  const activeBookings = bookings.filter(
    (booking) => booking.status !== "CANCELLED"
  ).length;

  // Count of PAID shop orders only (ignore pending/failed)
  const totalOrders = orders.filter(
    (order) => order.paymentStatus === "PAID"
  ).length;

  // Paid bookings → total spending from tickets
  const paidBookings = bookings.filter((booking) => {
    return (
      booking.paymentStatus === "PAID" ||
      booking.latestPayment?.status === "PAID" ||
      booking.payments?.some((payment) => payment.status === "PAID")
    );
  });

  const bookingPayments = paidBookings.reduce((sum, booking) => {
    return sum + Number(booking.totalPrice || 0);
  }, 0);

  // Paid orders → total spending from shop
  const orderPayments = orders
    .filter((order) => order.paymentStatus === "PAID")
    .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0);

  // Total spending = paid tickets + paid shop orders
  const totalPayments = bookingPayments + orderPayments;

  const loadingTotals = loadingBookings || loadingOrders;

  return (
    <DashboardLayout
      title={`Welcome, ${user?.name || "Customer"}`}
      subtitle="Here is your Ice Dome Cambodia account overview."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<CalendarCheck />}
          title="Bookings"
          value={
            loadingBookings ? (
              <Loader2 size={28} className="animate-spin text-blue-900" />
            ) : (
              activeBookings
            )
          }
          desc="Active bookings"
        />

        <StatCard
          icon={<ShoppingBag />}
          title="Orders"
          value={
            loadingOrders ? (
              <Loader2 size={28} className="animate-spin text-blue-900" />
            ) : (
              totalOrders
            )
          }
          desc="Paid orders"
        />

        <StatCard
          icon={<CreditCard />}
          title="Payments"
          value={
            loadingTotals ? (
              <Loader2 size={28} className="animate-spin text-blue-900" />
            ) : (
              `$${totalPayments.toFixed(2)}`
            )
          }
          desc="Total spending"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
          Quick Actions
        </h2>

        <p className="text-gray-500 mb-6">
          Start booking tickets, view your ticket history, or manage your
          profile.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="/tickets"
            className="px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition"
          >
            Book New Ticket
          </a>

          <a
            href="/dashboard/bookings"
            className="px-6 py-3 bg-blue-50 text-blue-900 rounded-xl font-bold hover:bg-blue-100 transition"
          >
            My Bookings
          </a>

          <a
            href="/dashboard/orders"
            className="px-6 py-3 bg-blue-50 text-blue-900 rounded-xl font-bold hover:bg-blue-100 transition"
          >
            Shop Orders
          </a>

          <a
            href="/dashboard/profile"
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition"
          >
            Edit Profile
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({ icon, title, value, desc }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
    <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-5">
      {icon}
    </div>

    <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
      {title}
    </p>

    <h3 className="text-3xl font-extrabold text-gray-900 mt-2 min-h-[36px] flex items-center">
      {value}
    </h3>

    <p className="text-gray-400 text-sm mt-1">{desc}</p>
  </div>
);