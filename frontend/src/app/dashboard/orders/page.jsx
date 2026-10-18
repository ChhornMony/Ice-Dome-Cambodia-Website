"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  ShoppingBag,
  Package,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  RefreshCcw,
} from "lucide-react";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

// Handles both old local uploads and new Cloudinary full URLs
const productImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${API_URL}${img}`;
  return `${API_URL}/uploads/products/${img}`;
};

const STATUS_CONFIG = {
  PAID: {
    label: "Paid",
    icon: CheckCircle,
    className: "bg-green-50 text-green-700 border border-green-100",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-50 text-yellow-700 border border-yellow-100",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border border-red-100",
  },
  REFUNDED: {
    label: "Refunded",
    icon: RotateCcw,
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const getToken = () => localStorage.getItem("token") || "";

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to load orders.");
      }

      setOrders(result.data.orders || []);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <DashboardLayout
      title="Shop Orders"
      subtitle="Track your equipment and shop orders."
    >
      {/* Loading */}
      {loading ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 py-20 text-center">
          <Loader2 size={32} className="animate-spin text-blue-900 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-500">Loading your orders...</p>
        </div>
      ) : error ? (
        /* Error */
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="rounded-2xl px-5 py-4 text-sm font-semibold flex items-start gap-3 bg-red-50 text-red-700 border border-red-100">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchOrders}
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition"
          >
            <RefreshCcw size={16} /> Try Again
          </button>
        </div>
      ) : orders.length === 0 ? (
        /* Empty state */
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">
                No shop orders yet
              </h2>
              <p className="text-gray-500 mt-1">
                Your equipment orders will appear here.
              </p>
            </div>
          </div>
          <a
            href="/shop"
            className="inline-block px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition"
          >
            Go to Shop
          </a>
        </div>
      ) : (
        /* Orders list */
        <div className="space-y-4">
          {/* Header row with refresh */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-gray-500">
              {orders.length} order{orders.length !== 1 ? "s" : ""} total
            </p>
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition"
            >
              <RefreshCcw size={14} /> Refresh
            </button>
          </div>

          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const status = STATUS_CONFIG[order.paymentStatus] || STATUS_CONFIG.PENDING;
            const StatusIcon = status.icon;
            const latestPayment = order.payments?.[0];

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order header */}
                <div
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm font-extrabold text-gray-900">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-bold">Total</p>
                      <p className="text-xl font-black text-gray-900">
                        ${Number(order.totalPrice).toFixed(2)}
                      </p>
                    </div>

                    <span className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-xl ${status.className}`}>
                      <StatusIcon size={13} />
                      {status.label}
                    </span>

                    {isExpanded ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-gray-100 p-5 sm:p-6 space-y-5">
                    {/* Items */}
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Package size={13} /> Items in this order
                      </p>
                      <div className="space-y-2">
                        {order.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl"
                          >
                            <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 overflow-hidden shrink-0">
                              {item.product?.image ? (
                                <img
                                  src={productImage(item.product.image)}
                                  alt={item.product?.name}
                                  className="w-full h-full object-contain p-1"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Package size={18} />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-extrabold text-gray-900 truncate">
                                {item.product?.name || "Product"}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-400 font-medium mt-0.5 flex-wrap">
                                {item.size && <span>Size: {item.size}</span>}
                                <span>Qty: {item.quantity}</span>
                                <span className="text-gray-300">·</span>
                                <span>${Number(item.price).toFixed(2)} each</span>
                              </div>
                            </div>

                            <p className="text-sm font-black text-gray-900 shrink-0">
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment info */}
                    {latestPayment && (
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-wide mb-2">
                          Payment
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <p className="text-blue-400 font-bold">Method</p>
                            <p className="text-blue-900 font-extrabold">Bakong KHQR</p>
                          </div>
                          <div>
                            <p className="text-blue-400 font-bold">Amount</p>
                            <p className="text-blue-900 font-extrabold">
                              ${Number(latestPayment.amount).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-blue-400 font-bold">Status</p>
                            <p className="text-blue-900 font-extrabold">{latestPayment.status}</p>
                          </div>
                          {latestPayment.paidAt && (
                            <div className="col-span-2 sm:col-span-3">
                              <p className="text-blue-400 font-bold">Paid on</p>
                              <p className="text-blue-900 font-extrabold">
                                {new Date(latestPayment.paidAt).toLocaleString("en-US")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Pickup note */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
                      <Package size={16} className="text-gray-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        Pick up your items at Ice Dome Cambodia. Please confirm product
                        size before collection.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}