"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ShieldCheck,
  Mail,
  Phone,
  User,
  Calendar,
  Clock,
  Copy,
  Lock,
  CheckCircle,
  Info,
  Users,
  Gift,
  Ticket,
  Headset,
  PackageCheck,
  Loader2,
  X,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/common/navbar";
import { useLocation, useNavigate } from "@/lib/router";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const ADD_ON_LABELS = {
  skates: { name: "Skate Rental", img: "/images/1.jpg" },
  helmet: { name: "Helmet Rental", img: "/images/2.jpg" },
  gloves: { name: "Gloves", img: "/images/3.jpg" },
  kneePads: { name: "Knee Pad Rental", img: "/images/5.jpg" },
};

const safeReadJson = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { success: false, message: text || "Invalid server response." };
  }
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    dayType = "weekday",
    date,
    addOns = {},
  } = location.state || {};

  // Support both the new multi-session shape (`sessions`, an array of
  // { session, ticketQty, subtotal }) and the old single-session shape
  // (`session` + `ticketQty`) so this page works either way.
  const bookings = useMemo(() => {
    const state = location.state || {};

    if (Array.isArray(state.sessions) && state.sessions.length > 0) {
      return state.sessions.map((entry) => ({
        session: entry.session || {},
        ticketQty: entry.ticketQty || 1,
        subtotal:
          entry.subtotal ??
          Number(entry.session?.price || 0) * (entry.ticketQty || 1),
      }));
    }

    if (state.session) {
      const qty = state.ticketQty || 1;
      return [
        {
          session: state.session,
          ticketQty: qty,
          subtotal: Number(state.session.price || 0) * qty,
        },
      ];
    }

    return [];
  }, [location.state]);

  const [copied, setCopied] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentProgress, setPaymentProgress] = useState("");

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrPayment, setQrPayment] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentCheckMessage, setPaymentCheckMessage] = useState("");

  const isWeekend = dayType === "weekend";

  const totalTickets = useMemo(
    () => bookings.reduce((sum, b) => sum + (b.ticketQty || 0), 0),
    [bookings]
  );

  const ticketTotal = useMemo(
    () => bookings.reduce((sum, b) => sum + (b.subtotal || 0), 0),
    [bookings]
  );

  const activeAddOns = Object.entries(addOns).filter(([, qty]) => qty > 0);

  // First session shown as the "primary" session for date/rate context.
  const primarySession = bookings[0]?.session || {};

  const bookingReference = qrPayment?.bookingId
    ? `#ICEDOME-${String(qrPayment.bookingId).slice(-8).toUpperCase()}`
    : "#ICEDOME-PENDING";

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  const formatDate = (iso) => {
    if (!iso) return "Not selected";
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Creates one booking per selected session. If any call fails partway
  // through, previously created bookings remain (the backend does not
  // currently support an all-or-nothing multi-session request), so the
  // error surfaces clearly rather than silently losing bookings.
  const createBookings = async () => {
    const token = getToken();
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
      throw new Error("You are not logged in. Please login again.");
    }

    if (!date || bookings.length === 0) {
      throw new Error(
        "Missing ticket or date. Please go back and select session again."
      );
    }

    const createdBookings = [];

    for (let i = 0; i < bookings.length; i += 1) {
      const { session, ticketQty } = bookings[i];
      const ticketId = session.ticketId || session.id;

      if (!ticketId) {
        throw new Error(
          "One of your selected sessions is missing an id. Please go back and reselect your sessions."
        );
      }

      setPaymentProgress(
        bookings.length > 1
          ? `Creating booking ${i + 1} of ${bookings.length}...`
          : "Creating booking..."
      );

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticketId,
          visitDate: date,
          quantity: ticketQty,
        }),
      });

      const result = await safeReadJson(response);

      if (!response.ok || !result.success) {
        const failedSoFar = createdBookings.length;
        throw new Error(
          (result.message || "Failed to create booking.") +
            (failedSoFar > 0
              ? ` (${failedSoFar} of ${bookings.length} bookings were already created before this failed — contact support with your reference if payment is needed for those.)`
              : "")
        );
      }

      createdBookings.push(result.data.booking);
    }

    return createdBookings;
  };

  // --- Create a single combined QR payment covering all bookings ---
  const createQRPayment = async (createdBookings) => {
    const token = getToken();
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
      throw new Error("You are not logged in. Please login again.");
    }

    setPaymentProgress("Creating payment QR...");

    const primaryBookingId = createdBookings[0].id;
    const allBookingIds = createdBookings.map((b) => b.id);

    // NOTE: this assumes /api/payments/qr/create can accept multiple
    // booking ids via `bookingIds` for a combined-total QR. If the
    // endpoint only supports a single `bookingId`, it will still work
    // for one session, but for multiple sessions the backend needs to
    // either accept `bookingIds` or you'll need a different combined-
    // payment endpoint — check with your API before relying on this
    // for real multi-session payments.
    const response = await fetch(`${API_URL}/api/payments/qr/create`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        bookingId: primaryBookingId,
        bookingIds: allBookingIds,
      }),
    });

    const result = await safeReadJson(response);
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create payment.");
    }
    return result.data;
  };

  const redirectToSuccess = useCallback(
    ({ booking, payment, bookingId }) => {
      setQrModalOpen(false);
      setPaymentCheckMessage("");
      toast.success("Booking confirmed! You have successfully bought your tickets.");
      navigate("/payment-success", { state: { booking, payment, bookingId } });
    },
    [navigate]
  );

  const checkPaymentStatus = useCallback(
    async (manual = true) => {
      try {
        if (!qrPayment?.paymentId) return;

        if (manual) {
          setCheckingPayment(true);
          setPaymentCheckMessage("");
          setPaymentError("");
        }

        const token = getToken();
        if (!token) {
          localStorage.setItem("redirectAfterLogin", "/checkout");
          navigate("/login");
          throw new Error("You are not logged in. Please login again.");
        }

        const response = await fetch(
          `${API_URL}/api/payments/qr/check/${qrPayment.paymentId}?t=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          }
        );

        const result = await safeReadJson(response);
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to check payment.");
        }

        const paid =
          result.paid === true ||
          result.data?.status === "PAID" ||
          result.data?.payment?.status === "PAID";

        if (paid) {
          redirectToSuccess({
            booking: result.data?.booking || null,
            payment: result.data?.payment || null,
            bookingId:
              result.bookingId ||
              result.data?.booking?.id ||
              result.data?.payment?.bookingId ||
              qrPayment.bookingId,
          });
          return;
        }

        if (manual) {
          setPaymentCheckMessage("Payment not detected yet. Please wait a few seconds and try again.");
        }
      } catch (error) {
        if (manual) {
          setPaymentError(error.message || "Payment check failed.");
        }
      } finally {
        if (manual) {
          setCheckingPayment(false);
        }
      }
    },
    [qrPayment, getToken, navigate, redirectToSuccess]
  );

  useEffect(() => {
    if (!qrModalOpen || !qrPayment?.paymentId) return;

    const delay = 6000;
    const timeout = setTimeout(() => checkPaymentStatus(false), delay);
    const interval = setInterval(() => checkPaymentStatus(false), delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [qrModalOpen, qrPayment?.paymentId, checkPaymentStatus]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
    }
  }, [navigate]);

  const handlePayment = async () => {
    try {
      setPaymentError("");
      setPaymentCheckMessage("");
      setPaying(true);

      const token = getToken();
      if (!token) {
        localStorage.setItem("redirectAfterLogin", "/checkout");
        navigate("/login");
        throw new Error("You are not logged in. Please login again.");
      }

      const createdBookings = await createBookings();
      const paymentData = await createQRPayment(createdBookings);

      setQrPayment(paymentData);
      setQrModalOpen(true);
    } catch (error) {
      setPaymentError(error.message || "Payment failed.");
    } finally {
      setPaying(false);
      setPaymentProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {qrModalOpen && qrPayment && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-6 relative">
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <QrCode size={28} />
              </div>

              <h2 className="text-2xl font-black text-gray-900">Scan to Pay</h2>

              <p className="mt-2 text-sm font-semibold text-gray-500">
                Open Bakong, ABA, ACLEDA, Wing, or any KHQR supported app and scan this QR.
              </p>

              <div className="mt-5 rounded-3xl border border-gray-100 bg-gray-50 p-4">
                <img
                  src={qrPayment.qrImage}
                  alt="Payment QR"
                  className="w-72 h-72 object-contain mx-auto rounded-2xl bg-white"
                />
              </div>

              <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                  Amount to pay (exact)
                </p>
                <p className="text-3xl font-black text-blue-900">
                  ${Number(qrPayment.amount).toFixed(2)}
                </p>
              </div>

              {paymentCheckMessage && (
                <div className="mt-4 rounded-2xl bg-yellow-50 border border-yellow-100 px-4 py-3">
                  <p className="text-xs font-bold text-yellow-700">{paymentCheckMessage}</p>
                </div>
              )}

              {paymentError && (
                <div className="mt-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-xs font-bold text-red-700">{paymentError}</p>
                </div>
              )}

              <p className="mt-3 text-xs font-semibold text-gray-400">
                This page checks payment automatically every 6 seconds. After payment is confirmed, you will go to the success page automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="w-full flex-grow pt-24 sm:pt-28 pb-10 sm:pb-16 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-5 sm:p-8 md:p-12">
          <div className="mb-7 sm:mb-8">
            <p className="text-[11px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-blue-600 mb-3">
              Ice Dome Cambodia
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              4. Checkout
            </h1>
            <p className="text-gray-500 mt-3 text-sm sm:text-lg font-medium leading-relaxed">
              Review your order and complete your booking securely.
            </p>
          </div>

          <div className="flex items-center justify-between relative mb-8 sm:mb-10 overflow-hidden">
            {[
              { id: 1, label: "Day" },
              { id: 2, label: "Session" },
              { id: 3, label: "Add-ons" },
              { id: 4, label: "Checkout" },
            ].map((step) => (
              <div key={step.id} className="flex flex-col items-center z-10 flex-1 min-w-0">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${
                    step.id < 4 ? "bg-gray-900 text-white" : "bg-blue-600 text-white shadow-lg shadow-blue-100"
                  }`}
                >
                  {step.id < 4 ? "✓" : step.id}
                </div>
                <span
                  className={`mt-2 text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wide text-center truncate max-w-[70px] ${
                    step.id === 4 ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
            <div className="absolute top-4 sm:top-5 left-0 w-full h-[2px] bg-gray-100 z-0" />
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-3xl overflow-hidden mb-6 sm:mb-8">
            <div className="px-4 sm:px-5 py-3 border-b border-blue-100 flex items-center gap-2">
              <Ticket size={15} className="text-blue-600 shrink-0" />
              <p className="text-xs font-extrabold text-blue-700 uppercase tracking-wide">
                Your Booking at a Glance
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-blue-100">
              <SummaryBox icon={<Calendar size={14} />} label="Date" value={formatShortDate(date)} desc={date ? new Date(date).getFullYear() : ""} />
              <SummaryBox
                icon={<Clock size={14} />}
                label="Sessions"
                value={
                  bookings.length > 1
                    ? `${bookings.length} sessions`
                    : primarySession.name || "—"
                }
                desc={bookings.length > 1 ? "See breakdown below" : primarySession.time || ""}
              />
              <SummaryBox
                icon={<Users size={14} />}
                label="Tickets"
                value={`${totalTickets} ${totalTickets === 1 ? "Person" : "People"}`}
                desc={`Total across ${bookings.length} ${bookings.length === 1 ? "session" : "sessions"}`}
              />
              <SummaryBox icon={<Info size={14} />} label="Rate" value={dayType} desc={isWeekend ? "Sat – Sun" : "Tue – Fri"} capitalize />
            </div>

            {bookings.length > 1 && (
              <div className="px-4 sm:px-5 py-3 border-t border-blue-100 space-y-1.5">
                {bookings.map((b, idx) => (
                  <div
                    key={b.session.id || idx}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <span className="font-bold text-blue-800 truncate">
                      {b.session.name || "Session"} · {b.session.time || ""} × {b.ticketQty}
                    </span>
                    <span className="font-black text-blue-900 shrink-0">
                      ${(b.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeAddOns.length > 0 && (
              <div className="px-4 sm:px-5 py-3 border-t border-blue-100 flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-1.5 mr-1 sm:mr-2">
                  <Gift size={13} className="text-green-500" />
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Free Add-ons</p>
                </div>
                {activeAddOns.map(([key, qty]) => (
                  <span key={key} className="flex items-center gap-1 bg-white border border-green-100 text-green-700 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {ADD_ON_LABELS[key]?.name || key} × {qty}
                  </span>
                ))}
              </div>
            )}
          </div>

          {bookings.length === 0 && (
            <div className="mb-6 rounded-2xl bg-yellow-50 border border-yellow-100 px-4 py-3">
              <p className="text-sm font-bold text-yellow-800">
                No sessions found for this order. Please go back and select your sessions again.
              </p>
            </div>
          )}

          {paymentError && (
            <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
              <p className="text-sm font-bold text-red-700">{paymentError}</p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5 sm:gap-6">
            <div className="space-y-5 sm:space-y-8">
              <section className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-6">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputWithIcon icon={<User size={17} />} type="text" placeholder="Full Name" />
                  <InputWithIcon icon={<Mail size={17} />} type="email" placeholder="Email Address" />
                  <div className="md:col-span-2">
                    <InputWithIcon icon={<Phone size={17} />} type="tel" placeholder="Phone Number" />
                  </div>
                </div>
              </section>

              {/* Payment method: QR only */}
              <section className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-6">
                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide mb-4">
                  Payment Method
                </h3>

                <div className="border border-gray-100 rounded-3xl overflow-hidden">
                  <div className="flex items-center justify-between gap-3 p-4 bg-blue-50/60">
                    <div className="flex items-center gap-3 min-w-0">
                      <QrCode size={17} className="text-blue-600 shrink-0" />
                      <span className="text-sm font-semibold text-gray-700 truncate">
                        Scan QR to Pay
                      </span>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-1 rounded shrink-0 bg-blue-600 text-white">
                      QR
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 sm:p-5 bg-blue-50 border border-blue-100 rounded-3xl">
                  <p className="text-sm font-bold text-blue-800">
                    {bookings.length > 1
                      ? "A single QR code will appear covering the combined total for all your selected sessions. Scan and pay using any KHQR-supported banking app."
                      : "A QR code will appear for you to scan and pay using any KHQR-supported banking app."}
                  </p>
                </div>
              </section>

              <div className="bg-blue-50/50 p-4 rounded-2xl flex items-start sm:items-center gap-3 border border-blue-100">
                <ShieldCheck className="text-blue-600 shrink-0" size={28} />
                <div>
                  <p className="text-sm font-bold text-blue-900">Secure Payment</p>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Payments are confirmed automatically once received
                  </p>
                </div>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-5">
                    <PackageCheck size={18} className="text-blue-600" />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Booking Summary</p>
                  </div>
                  <SideSummaryItem icon={<Calendar size={15} />} label="Date" value={formatDate(date)} />

                  {bookings.map((b, idx) => (
                    <SideSummaryItem
                      key={b.session.id || idx}
                      icon={<Clock size={15} />}
                      label={bookings.length > 1 ? `Session ${idx + 1}` : "Session"}
                      value={b.session.name || "—"}
                      desc={`${b.session.time || ""}${
                        b.session.time ? " · " : ""
                      }${b.ticketQty} × $${Number(b.session.price || 0).toFixed(2)}`}
                      price={`$${(b.subtotal || 0).toFixed(2)}`}
                    />
                  ))}
                </div>

                {activeAddOns.length > 0 && (
                  <div className="p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift size={14} className="text-green-500" />
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Free Add-ons Included</p>
                    </div>
                    <div className="space-y-3">
                      {activeAddOns.map(([key, qty]) => (
                        <div key={key} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-9 h-9 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                              <img src={ADD_ON_LABELS[key]?.img} alt="" className="w-full h-full object-contain p-1" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-700 truncate">{ADD_ON_LABELS[key]?.name || key}</p>
                              <p className="text-[10px] text-gray-400">× {qty} {qty === 1 ? "person" : "people"}</p>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-green-600 uppercase bg-green-50 px-2 py-1 rounded-lg shrink-0">Free</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">Tickets ({totalTickets}×)</span>
                    <span className="text-xs font-bold text-gray-700">${ticketTotal.toFixed(2)}</span>
                  </div>
                  {activeAddOns.length > 0 && (
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">Add-ons ({activeAddOns.length} items)</span>
                      <span className="text-xs font-bold text-green-600">$0.00</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                    <span className="font-extrabold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-gray-900">${ticketTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Booking Reference</p>
                <div className="flex items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3 mb-5">
                  <span className="text-xs sm:text-sm font-mono font-bold text-blue-900 truncate">{bookingReference}</span>
                  <button type="button" onClick={handleCopy} className="flex items-center gap-1 text-blue-400 hover:text-blue-600 transition shrink-0">
                    {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                    <span className="text-[10px] font-bold">{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
                <div className="flex items-start gap-2">
                  <Lock size={14} className="text-gray-300 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    By completing your booking, you agree to our{" "}
                    <span onClick={() => navigate("/terms-conditions")} className="text-blue-600 underline cursor-pointer">
                      Terms & Conditions
                    </span>.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition order-2 sm:order-1"
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              type="button"
              onClick={handlePayment}
              disabled={paying || !date || bookings.length === 0}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 order-1 sm:order-2 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {paying ? <Loader2 size={17} className="animate-spin" /> : <QrCode size={15} />}
              {paying ? paymentProgress || "Processing..." : `Pay $${ticketTotal.toFixed(2)}`}
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-8 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FooterItem icon={<ShieldCheck />} title="Secure Payment" desc="Encrypted and trusted checkout" />
          <FooterItem icon={<Clock />} title="Booking Review" desc="Confirm details before payment" />
          <FooterItem icon={<Headset />} title="Support" desc="Contact us for payment help" />
          <FooterItem icon={<QrCode />} title="KHQR" desc="Scan to pay with any KHQR app" />
        </div>
      </footer>
    </div>
  );
};

const SummaryBox = ({ icon, label, value, desc, capitalize }) => (
  <div className="px-4 sm:px-5 py-4">
    <div className="flex items-center gap-1.5 mb-1">
      <div className="text-blue-400 shrink-0">{icon}</div>
      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wide">{label}</p>
    </div>
    <p className={`text-sm font-extrabold text-gray-900 leading-tight truncate ${capitalize ? "capitalize" : ""}`}>{value}</p>
    {desc && <p className="text-[10px] text-gray-400 truncate">{desc}</p>}
  </div>
);

const InputWithIcon = ({ icon, type, placeholder }) => (
  <div className="relative">
    <div className="absolute left-3.5 top-3.5 text-gray-300">{icon}</div>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
    />
  </div>
);

const SideSummaryItem = ({ icon, label, value, desc, price }) => (
  <div className="flex items-start gap-3 mb-4 last:mb-0">
    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 text-blue-600">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      <div className="flex justify-between gap-3">
        <p className="text-sm font-extrabold text-gray-900 truncate">{value}</p>
        {price && <p className="text-sm font-extrabold text-blue-600 shrink-0">{price}</p>}
      </div>
      {desc && <p className="text-xs text-gray-400 truncate">{desc}</p>}
    </div>
  </div>
);

const FooterItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 px-4 py-3 lg:px-6 lg:border-r last:border-0 border-gray-100">
    <div className="text-blue-600 shrink-0">{icon}</div>
    <div>
      <p className="font-bold text-gray-900 text-sm">{title}</p>
      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
    </div>
  </div>
);

export default Checkout;