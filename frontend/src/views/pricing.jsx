"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Clock,
  Info,
  Calendar,
  Snowflake,
} from "lucide-react";
import Navbar from "@/components/common/navbar";


const Pricing = () => {
  const [activeTab, setActiveTab] = useState("weekdays");
  
  const router = useRouter();
  const scheduleData = {
    weekdays: [
      {
        id: 1,
        name: "Session 1",
        time: "12:30 PM – 2:30 PM",
        duration: "120 min",
        price: 7,
      },
      {
        id: 2,
        name: "Session 2",
        time: "1:00 PM – 2:30 PM",
        duration: "90 min",
        price: 6,
      },
      {
        id: 3,
        name: "Session 3",
        time: "1:30 PM – 2:30 PM",
        duration: "60 min",
        price: 5,
      },

      { type: "resurface" },

      {
        id: 4,
        name: "Session 4",
        time: "2:45 PM – 4:45 PM",
        duration: "120 min",
        price: 7,
      },
      {
        id: 5,
        name: "Session 5",
        time: "3:15 PM – 4:45 PM",
        duration: "90 min",
        price: 6,
      },
      {
        id: 6,
        name: "Session 6",
        time: "3:45 PM – 4:45 PM",
        duration: "60 min",
        price: 5,
      },

      { type: "resurface" },

      {
        id: 7,
        name: "Session 7",
        time: "5:00 PM – 7:00 PM",
        duration: "120 min",
        price: 7,
      },
      {
        id: 8,
        name: "Session 8",
        time: "6:00 PM – 7:30 PM",
        duration: "90 min",
        price: 6,
      },
      {
        id: 9,
        name: "Session 9",
        time: "6:30 PM – 7:30 PM",
        duration: "60 min",
        price: 5,
      },
    ],

    weekends: [
      {
        id: 1,
        name: "Session 1",
        time: "10:30 AM – 12:30 PM",
        duration: "120 min",
        price: 10,
      },
      {
        id: 2,
        name: "Session 2",
        time: "11:00 AM – 12:30 PM",
        duration: "90 min",
        price: 9,
      },
      {
        id: 3,
        name: "Session 3",
        time: "11:30 AM – 12:30 PM",
        duration: "60 min",
        price: 8,
      },

      { type: "resurface" },

      {
        id: 4,
        name: "Session 4",
        time: "12:45 PM – 2:45 PM",
        duration: "120 min",
        price: 10,
      },
      {
        id: 5,
        name: "Session 5",
        time: "1:15 PM – 2:45 PM",
        duration: "90 min",
        price: 9,
      },
      {
        id: 6,
        name: "Session 6",
        time: "1:45 PM – 2:45 PM",
        duration: "60 min",
        price: 8,
      },

      { type: "resurface" },

      {
        id: 7,
        name: "Session 7",
        time: "3:00 PM – 5:00 PM",
        duration: "120 min",
        price: 10,
      },
      {
        id: 8,
        name: "Session 8",
        time: "3:30 PM – 5:00 PM",
        duration: "90 min",
        price: 9,
      },
      {
        id: 9,
        name: "Session 9",
        time: "4:00 PM – 5:00 PM",
        duration: "60 min",
        price: 8,
      },

      { type: "resurface" },

      {
        id: 10,
        name: "Session 10",
        time: "5:15 PM – 7:15 PM",
        duration: "120 min",
        price: 10,
      },
      {
        id: 11,
        name: "Session 11",
        time: "5:45 PM – 7:15 PM",
        duration: "90 min",
        price: 9,
      },
      {
        id: 12,
        name: "Session 12",
        time: "6:15 PM – 7:15 PM",
        duration: "60 min",
        price: 8,
      },

      { type: "resurface" },

      {
        id: 13,
        name: "Session 13",
        time: "7:30 PM – 9:30 PM",
        duration: "120 min",
        price: 10,
      },
      {
        id: 14,
        name: "Session 14",
        time: "8:00 PM – 9:30 PM",
        duration: "90 min",
        price: 9,
      },
      {
        id: 15,
        name: "Session 15",
        time: "8:30 PM – 9:30 PM",
        duration: "60 min",
        price: 8,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl flex-grow">
        <div className="mb-10 text-center lg:text-left mt-15">
          <h1 className="text-3xl md:text-4xl font-black text-[#000B21] mb-2">
            Schedule & Prices
          </h1>
          <p className="text-gray-500 font-medium text-sm md:text-base">
            Plan your visit with our full session schedule and pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          {/* Left Side: Schedule */}
          <div className="flex flex-col h-full">
            <div className="flex flex-col sm:flex-row bg-white p-1.5 rounded-2xl mb-6 border border-gray-100 shadow-sm">
              <TabButton
                active={activeTab === "weekdays"}
                onClick={() => setActiveTab("weekdays")}
                icon={<Calendar size={18} />}
                text="Weekdays (Tue – Fri)"
              />

              <TabButton
                active={activeTab === "weekends"}
                onClick={() => setActiveTab("weekends")}
                icon={<Calendar size={18} />}
                text="Weekends (Sat – Sun)"
              />
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex-grow">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[450px]">
                  <thead className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-6 py-5">Session</th>
                      <th className="px-6 py-5">Time</th>
                      <th className="px-6 py-5">Duration</th>
                      <th className="px-6 py-5 text-right">Price</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {scheduleData[activeTab].map((row, index) =>
                      row.type === "resurface" ? (
                        <tr
                          key={`resurface-${index}`}
                          className="bg-blue-50/40"
                        >
                          <td colSpan="4" className="px-6 py-3">
                            <div className="flex items-center justify-center gap-2 text-blue-500 text-[10px] font-black tracking-widest">
                              <Snowflake size={14} />
                              ICE RESURFACING 15 MINUTES
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr
                          key={`${row.id}-${index}`}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-5 flex items-center gap-4">
                            <Clock size={18} className="text-blue-500" />
                            <span className="font-bold text-gray-800 text-sm md:text-base">
                              {row.name}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm text-gray-600 font-medium">
                            {row.time}
                          </td>

                          <td className="px-6 py-5 text-xs text-gray-400 font-bold uppercase">
                            {row.duration}
                          </td>

                          <td className="px-6 py-5 text-right font-black text-blue-600 text-lg">
                            ${row.price}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Side: Pricing Details */}
          <div className="flex flex-col h-full">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-sm flex flex-col h-full">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Info size={24} />
                </div>

                <h3 className="font-black text-xl text-[#000B21]">
                  Pricing Information
                </h3>
              </div>

              {/* Weekday Prices */}
              <div className="mb-10">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                  Weekday Prices
                </h4>

                <div className="space-y-5">
                  <PricingRow label="120 Minutes" price="$7.00" />
                  <PricingRow label="90 Minutes" price="$6.00" />
                  <PricingRow label="60 Minutes" price="$5.00" />
                </div>
              </div>

              {/* Weekend Prices */}
              <div className="mb-10 flex-grow">
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                  Weekend Prices
                </h4>

                <div className="space-y-5">
                  <PricingRow label="120 Minutes" price="$10.00" />
                  <PricingRow label="90 Minutes" price="$9.00" />
                  <PricingRow label="60 Minutes" price="$8.00" />
                </div>
              </div>

              {/* Note Box */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex gap-4 mt-auto">
                <Info size={20} className="text-blue-500 shrink-0" />
                <p className="text-xs font-bold text-blue-800 leading-relaxed">
                  Prices are in USD. <br />
                  Schedule may change. Please check before booking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Arrival Notice Bar */}
        <div className="mt-10 bg-[#000B21] rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shrink-0">
              <Clock size={24} />
            </div>

            <div className="text-center md:text-left">
              <p className="text-white text-sm font-black">
                Please arrive 20 minutes before your session.
              </p>
              <p className="text-blue-300 text-[11px] font-medium uppercase tracking-wider">
                Schedule subject to change. Please check before booking.
              </p>
            </div>
          </div>
          
          <button onClick={() => router.push("/tickets")} className="w-full md:w-auto flex items-center justify-center gap-2 bg-white px-8 py-3.5 rounded-2xl text-[#000B21] font-black text-sm hover:bg-blue-50 transition-all">
            <Calendar size={18} />
            BOOK SESSION
          </button>
        </div>
      </main>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, text }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-xl text-sm font-black transition-all ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
        : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span className="whitespace-nowrap uppercase">{text}</span>
  </button>
);

const PricingRow = ({ label, price }) => (
  <div className="flex justify-between items-center group border-b border-gray-50 pb-2">
    <span className="text-sm font-bold text-gray-600">{label}</span>
    <span className="text-base font-black text-gray-900">{price}</span>
  </div>
);

export default Pricing;