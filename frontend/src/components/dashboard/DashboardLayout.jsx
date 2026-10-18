"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/common/navbar";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ children, title, subtitle }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      window.location.href = "/login";
      return;
    }

    setUser(JSON.parse(savedUser));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-32 text-center font-bold text-gray-500">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500 mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <DashboardSidebar />

          <section className="flex-1">
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}