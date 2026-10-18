"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  ChevronRight,
  Clock,
  Ticket,
  ShieldCheck,
  Headset,
  CreditCard,
  Lock,
} from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useNavigate } from "@/lib/router";
import { useRouter } from "next/navigation";

const DAY_TYPE_STORAGE_KEY = "iceDome.selectedDayType";

const Booking = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    setLoggedIn(Boolean(token));
    setAuthChecked(true);
  }, []);

  // Restore the previously selected day type (e.g. after navigating
  // forward to Choose Session and then back to this page).
  useEffect(() => {
    const savedType = sessionStorage.getItem(DAY_TYPE_STORAGE_KEY);

    if (savedType === "weekday" || savedType === "weekend") {
      setSelectedType(savedType);
    }
  }, []);

  const handleSelectType = (type) => {
    setSelectedType(type);
    sessionStorage.setItem(DAY_TYPE_STORAGE_KEY, type);
  };

  const requireLoginBeforeBooking = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/tickets");
      navigate("/login");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!selectedType) return;

    if (!requireLoginBeforeBooking()) return;

    navigate("/choose-session", {
      state: {
        dayType: selectedType,
      },
    });
  };

  const steps = [
    { id: 1, label: "Select Day" },
    { id: 2, label: "Choose Session" },
    { id: 3, label: "Add-ons" },
    { id: 4, label: "Checkout" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="w-full flex-grow pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-12">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600 mb-3">
              Ice Dome Cambodia
            </p>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              1. Select Your Day
            </h1>

            <p className="text-gray-500 mt-3 text-lg font-medium">
              Choose whether you are booking for a weekday or weekend.
            </p>

            {authChecked && !loggedIn && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-yellow-50 border border-yellow-100 px-4 py-3">
                <Lock size={18} className="text-yellow-600 shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-yellow-800">
                  Please login first before booking a session. After login, you
                  can continue your booking.
                </p>
              </div>
            )}
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between relative mb-12">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center z-10 flex-1"
              >
                <div
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    step.id === 1
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.id}
                </div>

                <span
                  className={`mt-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-center ${
                    step.id === 1 ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}

            <div className="absolute top-5 left-0 w-full h-[2px] bg-gray-100 z-0" />
          </div>

          {/* Day Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => handleSelectType("weekday")}
              className={`p-8 rounded-3xl border-2 transition-all text-left group ${
                selectedType === "weekday"
                  ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100/60"
                  : "border-gray-100 hover:border-blue-200 bg-white hover:shadow-md"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  selectedType === "weekday"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <Calendar size={34} />
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                Weekdays
              </h3>

              <p className="text-gray-500 text-sm font-medium mb-4">
                Tuesday – Friday
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" />
                  Sessions from 12:30 PM
                </p>

                <p className="flex items-center gap-2">
                  <Ticket size={16} className="text-blue-500" />
                  Prices from $5
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectType("weekend")}
              className={`p-8 rounded-3xl border-2 transition-all text-left group ${
                selectedType === "weekend"
                  ? "border-blue-600 bg-blue-50 shadow-lg shadow-blue-100/60"
                  : "border-gray-100 hover:border-blue-200 bg-white hover:shadow-md"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative ${
                  selectedType === "weekend"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-600"
                }`}
              >
                <Calendar size={34} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full animate-ping" />
              </div>

              <h3 className="text-2xl font-extrabold text-gray-900 mb-1">
                Weekends
              </h3>

              <p className="text-gray-500 text-sm font-medium mb-4">
                Saturday – Sunday
              </p>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <Clock size={16} className="text-blue-500" />
                  Sessions from 10:30 AM
                </p>

                <p className="flex items-center gap-2">
                  <Ticket size={16} className="text-blue-500" />
                  Prices from $8
                </p>
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push("/pricing")}
            className="mt-8 text-blue-600 font-bold text-sm flex items-center justify-center gap-1 hover:underline mx-auto"
          >
            View full pricing & schedule <ChevronRight size={16} />
          </button>

          {/* Action Buttons */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-10 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition order-2 sm:order-1"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedType}
              className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition shadow-lg order-1 sm:order-2 ${
                selectedType
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                  : "bg-gray-300 text-white cursor-not-allowed shadow-none"
              }`}
            >
              {authChecked && loggedIn ? "Next" : "Login to Continue"}
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </main>

      {/* Footer Info Strip */}
      <footer className="bg-white border-t py-8 px-6 lg:px-12">
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

const FooterItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 px-4 lg:px-6 lg:border-r last:border-0 border-gray-100">
    <div className="text-blue-600">{icon}</div>

    <div>
      <p className="font-bold text-gray-900 text-sm">{title}</p>
      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
    </div>
  </div>
);

export default Booking;