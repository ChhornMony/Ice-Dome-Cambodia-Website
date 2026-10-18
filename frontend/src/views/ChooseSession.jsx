"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Sun,
  Moon,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Info,
  X,
  CheckCircle2,
  Snowflake,
  ShieldCheck,
  Headset,
  CreditCard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useNavigate, useLocation } from "@/lib/router";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const isSameDate = (dateA, dateB) => {
  if (!dateA || !dateB) return false;

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

const parseSessionTime = (selectedDate, timeText) => {
  if (!selectedDate || !timeText) return null;

  const cleanTime = String(timeText).trim().toUpperCase();
  const [timePart, period] = cleanTime.split(" ");

  if (!timePart || !period) return null;

  let [hours, minutes] = timePart.split(":").map(Number);

  if (Number.isNaN(hours)) return null;
  if (Number.isNaN(minutes)) minutes = 0;

  if (period === "PM" && hours !== 12) {
    hours += 12;
  }

  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  const sessionDateTime = new Date(selectedDate);
  sessionDateTime.setHours(hours, minutes, 0, 0);

  return sessionDateTime;
};

const isSessionStillAvailable = (session, selectedDate) => {
  if (!selectedDate) return true;

  const now = new Date();
  const bookingDate = new Date(selectedDate);

  const todayOnly = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const bookingDateOnly = new Date(
    bookingDate.getFullYear(),
    bookingDate.getMonth(),
    bookingDate.getDate()
  );

  if (bookingDateOnly < todayOnly) return false;
  if (bookingDateOnly > todayOnly) return true;

  const sessionStartTime = parseSessionTime(bookingDate, session.startTime);

  if (!sessionStartTime) return true;

  return sessionStartTime > now;
};

function CalendarPopup({ selectedDate, onSelect, onClose, isWeekend }) {
  const today = new Date();

  const [viewYear, setViewYear] = useState(
    selectedDate ? selectedDate.getFullYear() : today.getFullYear()
  );

  const [viewMonth, setViewMonth] = useState(
    selectedDate ? selectedDate.getMonth() : today.getMonth()
  );

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }
  };

  const isDisabled = (day) => {
    const date = new Date(viewYear, viewMonth, day);
    const dayOfWeek = date.getDay();

    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    if (date < todayOnly) return true;

    if (isWeekend) {
      return dayOfWeek !== 0 && dayOfWeek !== 6;
    }

    return dayOfWeek === 0 || dayOfWeek === 1 || dayOfWeek === 6;
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;

    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
    );
  };

  const isToday = (day) => {
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  };

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(day);
  }

  return (
    <div
      className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center px-3"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-5 sm:p-7 w-full max-w-sm shadow-2xl relative"
      >
        <div className="flex items-center justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.15em] text-gray-400">
              {isWeekend ? "Select Weekend Date" : "Select Weekday Date"}
            </p>

            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
              {MONTHS[viewMonth]} {viewYear}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center shrink-0"
          >
            <X size={17} />
          </button>
        </div>

        <div className="flex gap-3 mb-5">
          <button
            type="button"
            onClick={prevMonth}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600"
          >
            <ChevronLeft size={17} />
          </button>

          <button
            type="button"
            onClick={nextMonth}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600"
          >
            <ChevronRight size={17} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-extrabold text-gray-400 py-2 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} />;
            }

            const disabled = isDisabled(day);
            const selected = isSelected(day);
            const todayFlag = isToday(day);

            return (
              <button
                type="button"
                key={day}
                disabled={disabled}
                onClick={() => {
                  onSelect(new Date(viewYear, viewMonth, day));
                  onClose();
                }}
                className={`py-2 rounded-xl text-sm font-bold transition ${
                  selected
                    ? "bg-blue-600 text-white"
                    : todayFlag
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-800 hover:bg-blue-50"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-5 p-3 bg-blue-50 rounded-2xl flex items-center gap-3">
          <Info size={16} className="text-blue-600 shrink-0" />
          <span className="text-xs font-bold text-blue-800">
            {isWeekend
              ? "Only Saturday and Sunday are available."
              : "Only Tuesday to Friday are available."}
          </span>
        </div>
      </div>
    </div>
  );
}

const ChooseSession = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dayType = location.state?.dayType || "weekday";
  const isWeekend = dayType === "weekend";
  const apiDayType = isWeekend ? "WEEKEND" : "WEEKDAY";

  const [sessions, setSessions] = useState([]);
  // Now an array of selected session IDs instead of a single ID
  const [selectedSessions, setSelectedSessions] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${API_URL}/api/tickets?dayType=${apiDayType}&t=${Date.now()}`,
        {
          cache: "no-store",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load sessions.");
      }

      const activeOnlySessions = (result.data.tickets || []).filter(
        (session) => session.isActive === true
      );

      setSessions(activeOnlySessions);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    setSelectedSessions([]);
  }, [apiDayType]);

  const selectableSessions = useMemo(() => {
    return [...sessions]
      .filter((session) => isSessionStillAvailable(session, selectedDate))
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  }, [sessions, selectedDate]);

  // Drop any selected sessions that are no longer selectable (e.g. date changed)
  useEffect(() => {
    setSelectedSessions((prev) => {
      const stillValidIds = new Set(
        selectableSessions.map((session) => session.id)
      );
      const next = prev.filter((id) => stillValidIds.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [selectableSessions]);

  const toggleSession = (sessionId) => {
    setSelectedSessions((prev) =>
      prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const selectedSessionsData = useMemo(() => {
    return selectableSessions.filter((session) =>
      selectedSessions.includes(session.id)
    );
  }, [selectableSessions, selectedSessions]);

  const totalPrice = useMemo(() => {
    return selectedSessionsData.reduce(
      (sum, session) => sum + Number(session.price || 0),
      0
    );
  }, [selectedSessionsData]);

  const canProceed = selectedSessions.length > 0 && selectedDate;

  const formatDate = (date) => {
    if (!date) return null;

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleBack = () => {
    navigate("/tickets");
  };

  const handleNext = () => {
    if (selectedSessionsData.length > 0 && selectedDate) {
      navigate("/adds-on", {
        state: {
          dayType,
          ticketId: selectedSessionsData[0].id,
          ticketIds: selectedSessionsData.map((session) => session.id),
          sessions: selectedSessionsData.map((session) => ({
            id: session.id,
            ticketId: session.id,
            name: session.name,
            time: `${session.startTime} – ${session.endTime}`,
            duration: `${session.duration} min`,
            price: Number(session.price),
            startTime: session.startTime,
            endTime: session.endTime,
            dayType: session.dayType,
          })),
          // Kept for backward compatibility with pages expecting a single session
          session: {
            id: selectedSessionsData[0].id,
            ticketId: selectedSessionsData[0].id,
            name: selectedSessionsData[0].name,
            time: `${selectedSessionsData[0].startTime} – ${selectedSessionsData[0].endTime}`,
            duration: `${selectedSessionsData[0].duration} min`,
            price: Number(selectedSessionsData[0].price),
            startTime: selectedSessionsData[0].startTime,
            endTime: selectedSessionsData[0].endTime,
            dayType: selectedSessionsData[0].dayType,
          },
          date: selectedDate.toISOString(),
        },
      });
    }
  };

  const noAvailableMessage = selectedDate
    ? "No sessions are available for this date/time. Please choose another date or earlier session."
    : "Pick a date first to see available sessions.";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {calendarOpen && (
        <CalendarPopup
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          onClose={() => setCalendarOpen(false)}
          isWeekend={isWeekend}
        />
      )}

      <main className="w-full flex-grow pt-24 sm:pt-28 pb-10 sm:pb-16 px-3 sm:px-6">
        <div className="max-w-6xl mx-auto bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-5 sm:p-8 md:p-12">
          <div className="mb-7 sm:mb-8">
            <p className="text-[11px] sm:text-sm font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-blue-600 mb-3">
              Ice Dome Cambodia
            </p>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              2. Choose Session
            </h1>

            <p className="text-gray-500 mt-3 text-sm sm:text-lg font-medium leading-relaxed">
              {isWeekend
                ? "Weekend sessions for Saturday and Sunday."
                : "Weekday sessions for Tuesday to Friday."}
              {" "}You can select more than one session.
            </p>
          </div>

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
                    step.id < 2
                      ? "bg-gray-900 text-white"
                      : step.id === 2
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.id < 2 ? "✓" : step.id}
                </div>

                <span
                  className={`mt-2 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wide text-center truncate max-w-[70px] ${
                    step.id === 2 ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}

            <div className="absolute top-4 sm:top-5 left-0 w-full h-[2px] bg-gray-100 z-0" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={() => setCalendarOpen(true)}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl border-2 transition-all text-left ${
                selectedDate
                  ? "border-blue-200 bg-blue-50/40"
                  : "border-gray-100 bg-gray-50 hover:border-blue-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  selectedDate ? "bg-blue-600" : "bg-gray-200"
                }`}
              >
                <Calendar
                  size={18}
                  className={selectedDate ? "text-white" : "text-gray-400"}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  Date
                </p>
                <p
                  className={`text-sm font-bold truncate ${
                    selectedDate ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {selectedDate ? formatDate(selectedDate) : "Pick date"}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-3 px-4 py-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <Info size={18} className="text-blue-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  Rate Type
                </p>
                <p className="text-sm font-bold text-blue-700 truncate">
                  {isWeekend ? "Weekend Premium" : "Standard Weekday"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl">
              <Clock size={18} className="text-gray-400 shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                  Sessions
                </p>
                <p className="text-sm font-bold text-gray-700">
                  {selectableSessions.length} available
                </p>
              </div>
            </div>
          </div>

          {selectedDate && isSameDate(selectedDate, new Date()) && (
            <div className="mb-5 rounded-2xl border border-yellow-100 bg-yellow-50 px-4 py-3 flex items-start gap-3">
              <Info size={17} className="text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-bold text-yellow-800">
                Today selected: inactive sessions and sessions that already
                started are hidden.
              </p>
            </div>
          )}

          <div className="mb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Available Sessions
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Select one or more sessions
              </h2>
            </div>

            <p className="text-xs sm:text-sm font-bold text-gray-400">
              Price shown is per ticket
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-gray-50 border border-gray-100 py-16 text-center">
              <Loader2
                size={36}
                className="animate-spin text-blue-600 mx-auto mb-4"
              />
              <p className="font-black text-gray-900">Loading sessions...</p>
            </div>
          ) : errorMessage ? (
            <div className="rounded-3xl bg-red-50 border border-red-100 py-12 text-center px-5">
              <AlertCircle size={38} className="text-red-500 mx-auto mb-4" />
              <h3 className="font-black text-gray-900">
                Cannot load sessions
              </h3>
              <p className="text-sm text-red-500 mt-2">{errorMessage}</p>

              <button
                type="button"
                onClick={fetchSessions}
                className="mt-5 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition"
              >
                Try Again
              </button>
            </div>
          ) : selectableSessions.length === 0 ? (
            <div className="rounded-3xl bg-gray-50 border border-gray-100 py-12 text-center px-5">
              <Snowflake size={38} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-black text-gray-900">
                No available sessions
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {noAvailableMessage}
              </p>
            </div>
          ) : (
            <GroupedSessionList
              sessions={selectableSessions}
              selectedSessions={selectedSessions}
              toggleSession={toggleSession}
            />
          )}

          <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex items-center order-3 sm:order-none">
              {canProceed ? (
                <div className="flex flex-wrap items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                  <span className="text-sm font-bold text-gray-600">
                    {formatDate(selectedDate)} ·{" "}
                    {selectedSessions.length}{" "}
                    {selectedSessions.length === 1 ? "session" : "sessions"}{" "}
                    selected
                  </span>
                  <span className="text-sm font-extrabold text-blue-600">
                    Total: ${totalPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <p className="text-xs font-bold text-gray-400">
                  {!selectedDate
                    ? "Pick a date to continue"
                    : "Select at least one available session"}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-none w-full sm:w-auto">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition shadow-lg ${
                  canProceed
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                    : "bg-gray-300 text-white cursor-not-allowed shadow-none"
                }`}
              >
                Next
                <ChevronRight size={22} />
              </button>
            </div>
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
            title="Arrive Early"
            desc="Please arrive 20 minutes before session"
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

const groupSessions = (sessions) => {
  const sorted = [...sessions].sort(
    (a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
  );

  const groups = [];

  for (let i = 0; i < sorted.length; i += 3) {
    groups.push(sorted.slice(i, i + 3));
  }

  return groups;
};

const GroupedSessionList = ({ sessions, selectedSessions, toggleSession }) => {
  const groups = groupSessions(sessions);

  return (
    <div className="space-y-6 max-h-none md:max-h-[620px] md:overflow-y-auto md:pr-2">
      {groups.map((group, index) => {
        const first = Number(group[0]?.sortOrder || index * 3 + 1);
        const last = Number(group[group.length - 1]?.sortOrder || first + 2);
        const showResurfacing = index < groups.length - 1;

        return (
          <div
            key={index}
            className="rounded-[1.5rem] border border-gray-100 bg-white p-4 sm:p-5 shadow-sm"
          >
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                  Session Group {index + 1}
                </p>

                <h3 className="text-lg sm:text-xl font-black text-gray-900">
                  Sessions {first}–{last}
                </h3>
              </div>

              <p className="text-xs font-bold text-gray-400">
                Select any that apply
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {group.map((session) => (
                <SessionButton
                  key={session.id}
                  session={session}
                  active={selectedSessions.includes(session.id)}
                  onSelect={() => toggleSession(session.id)}
                />
              ))}
            </div>

            {showResurfacing && (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 flex items-center justify-center gap-2">
                <Snowflake size={16} className="text-blue-600 shrink-0" />
                <span className="text-[11px] sm:text-xs font-black text-blue-700 uppercase tracking-widest text-center">
                  Ice Resurfacing Break · 15 Minutes
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SessionButton = ({ session, active, onSelect }) => {
  const icon = getSessionIcon(session);
  const tag = getSessionTag(session);

  const tagStyles = {
    "Long Session": "bg-green-100 text-green-700",
    Popular: "bg-blue-100 text-blue-700",
    Morning: "bg-yellow-100 text-yellow-700",
    Evening: "bg-indigo-100 text-indigo-700",
    Night: "bg-slate-200 text-slate-700",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`w-full rounded-3xl border-2 p-4 sm:p-5 text-left transition-all ${
        active
          ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100"
          : "border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-white"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 mt-1 sm:mt-0 ${
              active
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-300"
            }`}
          >
            {active && <CheckCircle2 size={16} />}
          </div>

          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              active
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-100 shadow-sm"
            }`}
          >
            {icon}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base sm:text-lg font-black text-gray-900 leading-tight">
                {session.name}
              </h4>

              {tag && (
                <span
                  className={`text-[9px] sm:text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide ${
                    tagStyles[tag] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {tag}
                </span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 border border-gray-100">
                <Clock size={15} className="text-blue-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-gray-700">
                  {session.startTime} – {session.endTime}
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 border border-gray-100">
                <Clock size={15} className="text-gray-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-gray-700">
                  {session.duration} minutes
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
          <p
            className={`text-3xl font-black ${
              active ? "text-blue-600" : "text-blue-900"
            }`}
          >
            ${Number(session.price || 0).toFixed(2)}
          </p>

          <div
            className={`min-w-[100px] text-center px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wide ${
              active
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-100"
            }`}
          >
            {active ? "Selected" : "Select"}
          </div>
        </div>
      </div>
    </button>
  );
};

const getSessionIcon = (session) => {
  const start = String(session.startTime || "").toUpperCase();
  const duration = Number(session.duration || 0);

  if (duration === 120) {
    return <Sun size={21} className="text-amber-500" />;
  }

  if (duration === 90) {
    return <Cloud size={21} className="text-emerald-500" />;
  }

  if (start.includes("PM")) {
    const hour = Number(start.split(":")[0]);

    if (hour >= 5 || hour <= 9) {
      return <Moon size={21} className="text-indigo-600" />;
    }
  }

  return <Clock size={21} className="text-blue-500" />;
};

const getSessionTag = (session) => {
  const start = String(session.startTime || "").toUpperCase();
  const duration = Number(session.duration || 0);

  if (duration >= 120) return "Long Session";
  if (duration === 90) return "Popular";
  if (start.includes("10:") || start.includes("11:")) return "Morning";
  if (start.includes("5:") || start.includes("6:") || start.includes("7:"))
    return "Evening";
  if (start.includes("8:")) return "Night";

  return null;
};

const FooterItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 px-4 py-3 lg:px-6 lg:border-r last:border-0 border-gray-100">
    <div className="text-blue-600 shrink-0">{icon}</div>

    <div>
      <p className="font-bold text-gray-900 text-sm">{title}</p>
      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
    </div>
  </div>
);

export default ChooseSession;