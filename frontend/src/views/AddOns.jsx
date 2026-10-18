"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Plus,
  Minus,
  Users,
  Calendar,
  Ticket,
  ShieldCheck,
  Clock,
  Headset,
  CreditCard,
  PackageCheck,
} from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useNavigate, useLocation } from "@/lib/router";

const AddOns = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { dayType, date } = location.state || {};

  // Support both the new multi-session shape (`sessions`) and the old
  // single-session shape (`session`) so this page still works if it's
  // ever reached with legacy nav state.
  const sessions = useMemo(() => {
    if (Array.isArray(location.state?.sessions) && location.state.sessions.length > 0) {
      return location.state.sessions;
    }

    if (location.state?.session) {
      return [location.state.session];
    }

    return [];
  }, [location.state]);

  // Per-session ticket quantity, keyed by session.id.
  // NOTE: sessions can arrive a tick after first render (router state
  // hydration), so this can't just be a lazy useState initializer that
  // only runs once on mount — it needs to stay in sync whenever the
  // sessions list itself changes (e.g. becomes populated, or a session
  // is added/removed), otherwise lookups here silently miss and fall
  // back to 0 in totals while the UI's own `|| 1` fallback keeps
  // rendering "× 1", making the two disagree.
  const [ticketQtyBySession, setTicketQtyBySession] = useState({});

  React.useEffect(() => {
    setTicketQtyBySession((prev) => {
      let changed = false;
      const next = { ...prev };

      sessions.forEach((s) => {
        if (!(s.id in next)) {
          next[s.id] = 1;
          changed = true;
        }
      });

      // Drop quantities for sessions that are no longer selected
      Object.keys(next).forEach((id) => {
        if (!sessions.some((s) => s.id === id)) {
          delete next[id];
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [sessions]);

  // Always read with a fallback of 1 (never 0) so a session that hasn't
  // been keyed into state yet still counts as "at least one ticket" —
  // matching what the UI already displays via its own `|| 1` fallback.
  const getTicketQty = (sessionId) => ticketQtyBySession[sessionId] ?? 1;

  const totalTickets = useMemo(() => {
    return sessions.reduce((sum, s) => sum + getTicketQty(s.id), 0);
  }, [sessions, ticketQtyBySession]);

  // Add-ons are a single shared pool of free rental items, capped by
  // the total number of tickets across all selected sessions.
  const [quantities, setQuantities] = useState({
    skates: 1,
    helmet: 1,
    gloves: 1,
    kneePads: 1,
  });

  const [selected, setSelected] = useState({
    skates: true,
    helmet: true,
    gloves: true,
    kneePads: true,
  });

  const addOnOptions = [
    {
      id: "skates",
      name: "Skate Rental",
      desc: "High-quality ice skates",
      img: "/images/1.jpg",
    },
    {
      id: "helmet",
      name: "Helmet Rental",
      desc: "Safety first",
      img: "/images/2.jpg",
    },
    {
      id: "gloves",
      name: "Gloves",
      desc: "Keep your hands warm",
      img: "/images/3.jpg",
    },
    {
      id: "kneePads",
      name: "Knee Pad Rental",
      desc: "Extra protection and comfort",
      img: "/images/5.jpg",
    },
  ];

  const ticketsTotalPrice = useMemo(() => {
    return sessions.reduce((sum, s) => {
      return sum + Number(s.price || 0) * getTicketQty(s.id);
    }, 0);
  }, [sessions, ticketQtyBySession]);

  const selectedAddOns = addOnOptions.filter((item) => selected[item.id]);

  const toggleItem = (id) => {
    setSelected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const clampQty = (value, min, max) => {
    if (Number.isNaN(value)) return min;
    return Math.min(max, Math.max(min, value));
  };

  const changeQty = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: clampQty(prev[id] + delta, 1, totalTickets || 1),
    }));
  };

  const setQtyDirect = (id, rawValue) => {
    const parsed = parseInt(rawValue, 10);

    setQuantities((prev) => ({
      ...prev,
      [id]: clampQty(parsed, 1, totalTickets || 1),
    }));
  };

  const changeTicketQty = (sessionId, delta) => {
    setTicketQtyBySession((prev) => {
      const current = prev[sessionId] ?? 1;
      const next = clampQty(current + delta, 1, 10);
      const updated = { ...prev, [sessionId]: next };

      const newTotal = sessions.reduce(
        (sum, s) => sum + (updated[s.id] || 0),
        0
      );

      setQuantities((q) => {
        const capped = {};
        Object.keys(q).forEach((key) => {
          capped[key] = Math.min(q[key], newTotal || 1);
        });
        return capped;
      });

      return updated;
    });
  };

  const setTicketQtyDirect = (sessionId, rawValue) => {
    const parsed = parseInt(rawValue, 10);
    const next = clampQty(parsed, 1, 10);

    setTicketQtyBySession((prev) => {
      const updated = { ...prev, [sessionId]: next };

      const newTotal = sessions.reduce(
        (sum, s) => sum + (updated[s.id] || 0),
        0
      );

      setQuantities((q) => {
        const capped = {};
        Object.keys(q).forEach((key) => {
          capped[key] = Math.min(q[key], newTotal || 1);
        });
        return capped;
      });

      return updated;
    });
  };

  const formatDate = (value) => {
    if (!value) return "No date selected";

    return new Date(value).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleBack = () => {
    navigate("/choose-session", {
      state: {
        dayType,
      },
    });
  };

  const handleNext = () => {
    const addOns = {};

    addOnOptions.forEach((item) => {
      addOns[item.id] = selected[item.id] ? quantities[item.id] : 0;
    });

    const sessionBookings = sessions.map((s) => ({
      session: s,
      ticketQty: getTicketQty(s.id),
      subtotal: Number(s.price || 0) * getTicketQty(s.id),
    }));

    navigate("/checkout", {
      state: {
        dayType,
        date,
        sessions: sessionBookings,
        // Backward-compatible single-session fields (first session)
        session: sessions[0],
        ticketQty: sessions[0] ? getTicketQty(sessions[0].id) : 1,
        addOns,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="w-full flex-grow pt-24 sm:pt-28 pb-10 sm:pb-16 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-5 sm:p-8 md:p-12">
          <div className="mb-7 sm:mb-8">
            <p className="text-[11px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-blue-600 mb-3">
              Ice Dome Cambodia
            </p>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              3. Add-ons
            </h1>

            <p className="text-gray-500 mt-3 text-sm sm:text-lg font-medium leading-relaxed">
              Choose ticket quantity for each session and optional free
              rental items.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between relative mb-8 sm:mb-10 overflow-hidden">
            {[
              { id: 1, label: "Day" },
              { id: 2, label: "Session" },
              { id: 3, label: "Add-ons" },
              { id: 4, label: "Checkout" },
            ].map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center z-10 flex-1 min-w-0"
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${
                    step.id < 3
                      ? "bg-gray-900 text-white"
                      : step.id === 3
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.id < 3 ? "✓" : step.id}
                </div>

                <span
                  className={`mt-2 text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wide text-center truncate max-w-[70px] ${
                    step.id === 3 ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}

            <div className="absolute top-4 sm:top-5 left-0 w-full h-[2px] bg-gray-100 z-0" />
          </div>

          {/* Booking Summary Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <SummaryChip
              icon={<Calendar size={18} />}
              label="Date"
              value={formatDate(date)}
            />

            <SummaryChip
              icon={<Clock size={18} />}
              label="Sessions"
              value={`${sessions.length} selected`}
            />

            <SummaryChip
              icon={<Ticket size={18} />}
              label="Total Tickets"
              value={`${totalTickets} ticket${totalTickets === 1 ? "" : "s"}`}
            />
          </div>

          {sessions.length === 0 ? (
            <div className="mb-8 p-6 border-2 border-dashed border-gray-200 rounded-3xl text-center">
              <p className="text-sm font-bold text-gray-500">
                No sessions selected. Please go back and choose at least one
                session.
              </p>
            </div>
          ) : (
            <div className="mb-6 sm:mb-8 space-y-4">
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                Ticket Quantity per Session
              </h3>

              {sessions.map((s) => {
                const qty = getTicketQty(s.id);
                const subtotal = Number(s.price || 0) * qty;

                return (
                  <div
                    key={s.id}
                    className="p-4 sm:p-5 border-2 border-blue-100 bg-blue-50/30 rounded-3xl"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                          <Users size={22} className="text-white" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-extrabold text-gray-900 text-sm sm:text-base">
                            {s.name || "Session"}
                          </p>

                          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-relaxed truncate">
                            {s.time || "No time"}
                          </p>

                          <p className="text-[10px] sm:text-[11px] font-extrabold text-blue-600 uppercase tracking-wide mt-1">
                            ${Number(s.price || 0).toFixed(2)} per person
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <QtyControl
                          value={qty}
                          min={1}
                          max={10}
                          onMinus={() => changeTicketQty(s.id, -1)}
                          onPlus={() => changeTicketQty(s.id, 1)}
                          onChange={(val) => setTicketQtyDirect(s.id, val)}
                        />

                        <div className="text-right min-w-[80px]">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                            Subtotal
                          </p>
                          <p className="text-2xl font-black text-blue-600">
                            ${subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add-ons */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-end justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900">
                  Add-ons{" "}
                  <span className="text-gray-400 font-medium text-sm">
                    Optional
                  </span>
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  Enhance your experience with free rental items. Shared
                  across all sessions, up to your total ticket count.
                </p>
              </div>
            </div>

            <div className="flex items-start sm:items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl mb-5">
              <div className="bg-blue-600 p-2 rounded-xl shrink-0">
                <Gift size={18} className="text-white" />
              </div>

              <p className="text-sm font-semibold text-blue-700 leading-relaxed">
                Good news!{" "}
                <span className="font-normal text-blue-600">
                  These rental items are free with your ticket.
                </span>
              </p>
            </div>

            <div className="space-y-3 max-h-none md:max-h-[380px] md:overflow-y-auto md:pr-1">
              {addOnOptions.map((item) => {
                const isOn = selected[item.id];
                const qty = quantities[item.id];

                return (
                  <div
                    key={item.id}
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-2 rounded-3xl transition-all ${
                      isOn
                        ? "border-blue-200 bg-blue-50/30"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 sm:gap-4 cursor-pointer flex-1 min-w-0"
                      onClick={() => toggleItem(item.id)}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isOn
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {isOn && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-11 h-11 sm:w-12 sm:h-12 object-contain"
                        />
                      </div>

                      <div className="min-w-0">
                        <h4
                          className={`font-extrabold text-sm ${
                            isOn ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {item.name}
                        </h4>

                        <p className="text-xs text-gray-400 truncate">
                          {item.desc}
                        </p>

                        <p className="text-[10px] font-extrabold text-green-600 uppercase tracking-wide mt-1">
                          Free · $0
                        </p>
                      </div>
                    </div>

                    <div
                      className="flex items-center justify-between sm:justify-end gap-3 shrink-0 sm:ml-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isOn ? (
                        <>
                          <QtyControl
                            value={qty}
                            min={1}
                            max={totalTickets || 1}
                            small
                            onMinus={() => changeQty(item.id, -1)}
                            onPlus={() => changeQty(item.id, 1)}
                            onChange={(val) => setQtyDirect(item.id, val)}
                          />

                          <span className="text-[10px] font-bold text-gray-400 uppercase w-14 text-center">
                            of {totalTickets || 1}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                          Not included
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <PackageCheck size={18} className="text-blue-600 shrink-0" />
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">
                Order Summary
              </p>
            </div>

            {sessions.map((s) => {
              const qty = getTicketQty(s.id);
              const subtotal = Number(s.price || 0) * qty;

              return (
                <SummaryRow
                  key={s.id}
                  label={`${s.name || "Session"} × ${qty}`}
                  value={`$${subtotal.toFixed(2)}`}
                />
              );
            })}

            {selectedAddOns.map((item) => (
              <SummaryRow
                key={item.id}
                label={`${item.name} × ${quantities[item.id]}`}
                value="Free"
                free
              />
            ))}

            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
              <span className="font-extrabold text-gray-900">Total</span>
              <span className="text-2xl font-black text-blue-600">
                ${ticketsTotalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition order-2 sm:order-1"
            >
              <ChevronLeft size={18} />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={sessions.length === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition shadow-lg order-1 sm:order-2 ${
                sessions.length === 0
                  ? "bg-gray-300 text-white cursor-not-allowed shadow-none"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
              }`}
            >
              Next
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-8 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FooterItem
            icon={<ShieldCheck />}
            title="Secure Booking"
            desc="Your booking data is protected"
          />
          <FooterItem
            icon={<Clock />}
            title="Free Rentals"
            desc="Selected add-ons are free"
          />
          <FooterItem
            icon={<Headset />}
            title="Support"
            desc="Contact us for booking help"
          />
          <FooterItem
            icon={<CreditCard />}
            title="Secure Payment"
            desc="Encrypted and trusted checkout"
          />
        </div>
      </footer>
    </div>
  );
};

const SummaryChip = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
    <div className="text-blue-600 shrink-0">{icon}</div>

    <div className="min-w-0">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
        {label}
      </p>

      <p className="text-sm font-bold text-gray-700 truncate">{value}</p>
    </div>
  </div>
);

const QtyControl = ({
  value,
  min,
  max,
  onMinus,
  onPlus,
  onChange,
  small = false,
}) => {
  const [draft, setDraft] = useState(String(value));

  // Keep the text box in sync when value changes from +/- buttons
  React.useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = () => {
    if (draft === "" || Number.isNaN(parseInt(draft, 10))) {
      setDraft(String(value));
      return;
    }

    onChange(draft);
  };

  return (
    <div
      className={`flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-2 py-1.5 shadow-sm ${
        small ? "scale-95 origin-left" : ""
      }`}
    >
      <button
        type="button"
        onClick={onMinus}
        disabled={value <= min}
        className={`${
          small ? "w-7 h-7" : "w-8 h-8"
        } rounded-lg flex items-center justify-center transition ${
          value <= min
            ? "text-gray-300 cursor-not-allowed"
            : "text-blue-600 hover:bg-blue-50"
        }`}
      >
        <Minus size={small ? 13 : 15} />
      </button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={commitDraft}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        className={`${
          small ? "w-8 text-sm" : "w-9 text-base"
        } text-center font-extrabold text-gray-900 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-md`}
      />

      <button
        type="button"
        onClick={onPlus}
        disabled={value >= max}
        className={`${
          small ? "w-7 h-7" : "w-8 h-8"
        } rounded-lg flex items-center justify-center transition ${
          value >= max
            ? "text-gray-300 cursor-not-allowed"
            : "text-blue-600 hover:bg-blue-50"
        }`}
      >
        <Plus size={small ? 13 : 15} />
      </button>
    </div>
  );
};

const SummaryRow = ({ label, value, free }) => (
  <div className="flex justify-between items-start gap-4 mb-2">
    <span className="text-sm text-gray-600 font-medium">{label}</span>
    <span
      className={`text-sm font-bold shrink-0 ${
        free ? "text-green-600" : "text-gray-900"
      }`}
    >
      {value}
    </span>
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

export default AddOns;