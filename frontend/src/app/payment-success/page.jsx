"use client";

import React from "react";
import {
  CheckCircle,
  Calendar,
  Clock,
  Ticket,
  Home,
  Download,
  ShieldCheck,
  QrCode,
  ShoppingBag,
  Package,
  Receipt,
  CreditCard,
} from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useLocation, useNavigate } from "@/lib/router";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

// Handles both old local uploads and new Cloudinary full URLs
const productImage = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img;
  if (img.startsWith("/uploads")) return `${API_URL}${img}`;
  return `${API_URL}/uploads/products/${img}`;
};

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { booking, payment, bookingId, order, orderId } =
    location.state || {};

  // Detect whether this is a shop order or a ticket booking
  const isOrder = Boolean(order || orderId || payment?.orderId);

  const paid =
    payment?.status === "PAID" ||
    booking?.paymentStatus === "PAID" ||
    booking?.status === "CONFIRMED" ||
    order?.paymentStatus === "PAID";

  const finalId = isOrder
    ? order?.id || orderId || payment?.orderId
    : booking?.id || bookingId || payment?.bookingId;

  const reference = finalId
    ? `#ICEDOME-${finalId.slice(-8).toUpperCase()}`
    : "#ICEDOME";

  const items = order?.items || [];

  const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const amountPaid = Number(
    payment?.amount || order?.totalPrice || booking?.totalPrice || 0
  ).toFixed(2);

  const formatDate = (date) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ── Not paid guard ──
  if (!paid) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-12">
          <div className="max-w-md w-full bg-white rounded-[2rem] border border-red-100 shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <ShieldCheck size={34} />
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              Payment Not Verified
            </h1>
            <p className="mt-3 text-sm font-medium text-gray-500 leading-relaxed">
              This success page only opens after your payment is verified
              by the backend.
            </p>
            <button
              type="button"
              onClick={() => navigate(isOrder ? "/cart" : "/checkout")}
              className="mt-6 w-full rounded-xl bg-blue-600 text-white py-3 font-black hover:bg-blue-700"
            >
              {isOrder ? "Back to Cart" : "Back to Checkout"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/60 border border-gray-100 overflow-hidden">

            {/* ── Success header ── */}
            <div className="bg-green-50 border-b border-green-100 px-6 sm:px-10 py-10 text-center">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-100">
                <CheckCircle size={44} />
              </div>

              <p className="text-xs font-black tracking-[0.25em] uppercase text-green-600 mb-3">
                Payment Successful
              </p>

              <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
                {isOrder ? "Your Order is Confirmed" : "Your Booking is Confirmed"}
              </h1>

              <p className="mt-3 text-sm sm:text-base font-medium text-gray-500">
                {isOrder
                  ? "Thank you for shopping with Ice Dome Cambodia."
                  : "Thank you for booking with Ice Dome Cambodia."}
              </p>
            </div>

            <div className="p-6 sm:p-10">

              {/* ── Reference ── */}
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 sm:p-6 mb-6">
                <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">
                  {isOrder ? "Order Reference" : "Booking Reference"}
                </p>
                <p className="text-2xl sm:text-3xl font-black text-blue-900">
                  {reference}
                </p>
              </div>

              {/* ════════ SHOP ORDER VIEW ════════ */}
              {isOrder ? (
                <>
                  {/* Quick info cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <InfoCard
                      icon={<Package size={20} />}
                      label="Items"
                      value={`${totalQty} ${totalQty === 1 ? "item" : "items"}`}
                    />
                    <InfoCard
                      icon={<Calendar size={20} />}
                      label="Order Date"
                      value={
                        order?.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Today"
                      }
                    />
                    <InfoCard
                      icon={<QrCode size={20} />}
                      label="Payment"
                      value={payment?.status || order?.paymentStatus || "PAID"}
                    />
                  </div>

                  {/* Product list */}
                  <div className="rounded-3xl border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                      <ShoppingBag size={15} className="text-blue-600" />
                      <p className="text-xs font-black text-gray-600 uppercase tracking-wide">
                        Items Purchased
                      </p>
                    </div>

                    <div className="divide-y divide-gray-50">
                      {items.length === 0 ? (
                        <div className="px-5 py-6 text-center text-sm font-semibold text-gray-400">
                          Order items will appear in your order history.
                        </div>
                      ) : (
                        items.map((item) => (
                          <div
                            key={item.id || item.productId}
                            className="flex items-center gap-4 px-5 py-4"
                          >
                            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                              {item.product?.image ? (
                                <img
                                  src={productImage(item.product.image)}
                                  alt={item.product?.name || "Product"}
                                  className="w-full h-full object-contain p-1.5"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <Package size={20} />
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-black text-gray-900 truncate">
                                {item.product?.name || "Product"}
                              </p>
                              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mt-1 flex-wrap">
                                {item.size && (
                                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                                    Size {item.size}
                                  </span>
                                )}
                                <span>Qty: {item.quantity}</span>
                                <span className="text-gray-300">·</span>
                                <span>${Number(item.price).toFixed(2)} each</span>
                              </div>
                            </div>

                            <p className="text-sm font-black text-gray-900 shrink-0">
                              ${(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Pickup note */}
                  <div className="flex items-start gap-3 rounded-3xl bg-blue-50 border border-blue-100 p-5 mb-6">
                    <Package size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-black text-blue-900">
                        Pickup at Ice Dome Cambodia
                      </p>
                      <p className="text-xs font-medium text-blue-600 mt-1 leading-relaxed">
                        Collect your items at our front desk. Please confirm
                        product sizes before collection and bring this confirmation.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                /* ════════ TICKET BOOKING VIEW ════════ */
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <InfoCard
                      icon={<Ticket size={20} />}
                      label="Ticket"
                      value={booking?.ticket?.name || "Ice Skating Ticket"}
                    />
                    <InfoCard
                      icon={<Calendar size={20} />}
                      label="Visit Date"
                      value={formatDate(booking?.visitDate)}
                    />
                    <InfoCard
                      icon={<Clock size={20} />}
                      label="Status"
                      value={booking?.status || "CONFIRMED"}
                    />
                    <InfoCard
                      icon={<QrCode size={20} />}
                      label="Payment"
                      value={payment?.status || "PAID"}
                    />
                  </div>

                  {booking?.qrCode && (
                    <div className="rounded-3xl border border-gray-100 bg-gray-50 p-5 text-center mb-6">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                        Ticket QR Code
                      </p>
                      <div className="inline-flex items-center justify-center bg-white border border-gray-200 rounded-2xl px-5 py-4">
                        <p className="font-mono font-black text-gray-900">
                          {booking.qrCode}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* ── Payment summary (shared) ── */}
              <div className="rounded-3xl bg-gray-50 border border-gray-100 p-5 mb-7">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                  <Receipt size={15} className="text-gray-400" />
                  <p className="text-xs font-black text-gray-500 uppercase tracking-wide">
                    Payment Summary
                  </p>
                </div>

                {isOrder && items.length > 0 && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-500">Subtotal</span>
                    <span className="font-black text-gray-900">${amountPaid}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-gray-500">Payment Method</span>
                  <span className="font-black text-gray-900 flex items-center gap-1.5">
                    <CreditCard size={14} className="text-blue-600" />
                    KHQR
                  </span>
                </div>

                {/* --- Transaction ID: now shown for BOTH orders and ticket bookings --- */}
                {payment?.transactionId && (
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-500">Transaction ID</span>
                    <span className="font-mono font-bold text-gray-700 text-xs truncate max-w-[180px]">
                      {payment.transactionId}
                    </span>
                  </div>
                )}
                {/* ------------------------------------------------------------------- */}

                <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-100">
                  <span className="font-black text-gray-900">Total Paid</span>
                  <span className="text-2xl font-black text-green-600">
                    ${amountPaid}
                  </span>
                </div>
              </div>

              {/* ── Actions ── */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-gray-700 py-3 font-black hover:bg-gray-50"
                >
                  <Download size={18} />
                  {isOrder ? "Print Receipt" : "Print Ticket"}
                </button>

                {isOrder ? (
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/orders")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 font-black hover:bg-blue-700"
                  >
                    <ShoppingBag size={18} />
                    View My Orders
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard/bookings")}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 font-black hover:bg-blue-700"
                  >
                    <Ticket size={18} />
                    My Bookings
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-800 py-3 font-black hover:bg-gray-200"
                >
                  <Home size={18} />
                  Home
                </button>
              </div>
            </div>
          </div>

          <p className="text-center mt-5 text-xs font-semibold text-gray-400">
            {isOrder
              ? "Please show this confirmation when collecting your items at Ice Dome Cambodia."
              : "Please show this confirmation at Ice Dome Cambodia when you arrive."}
          </p>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="rounded-3xl border border-gray-100 bg-white p-5">
    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
      {icon}
    </div>
    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <p className="text-sm font-black text-gray-900 break-words">{value}</p>
  </div>
);

export default PaymentSuccess;