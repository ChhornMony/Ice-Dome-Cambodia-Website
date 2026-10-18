"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  Headset,
  CreditCard,
  LogIn,
  Sparkles,
  CheckCircle2,
  Bell,
} from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useNavigate } from "@/lib/router";

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

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      const redirectAfterLogin =
        localStorage.getItem("redirectAfterLogin") || "/dashboard";

      localStorage.removeItem("redirectAfterLogin");

      navigate(redirectAfterLogin);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col font-sans">
      <Navbar />

      <main className="w-full flex-grow pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] bg-white rounded-[2.2rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
            <div className="relative bg-blue-950 text-white p-8 md:p-12 flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-2 mb-8">
                  <Sparkles size={16} className="text-blue-200" />
                  <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-100">
                    Ice Dome Cambodia
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                  Welcome Back
                </h1>

                <p className="text-blue-100 text-lg leading-relaxed mb-10 max-w-md">
                  Sign in to manage your bookings, view your ticket history,
                  receive announcements, and continue your Ice Dome experience.
                </p>

                <div className="space-y-5">
                  <InfoItem
                    icon={<ShieldCheck />}
                    title="Secure Login"
                    desc="Your account and booking data are protected."
                  />

                  <InfoItem
                    icon={<Clock />}
                    title="Manage Bookings"
                    desc="View your skating sessions and payment status."
                  />

                  <InfoItem
                    icon={<Bell />}
                    title="Notifications"
                    desc="Receive important updates from Ice Dome Cambodia."
                  />
                </div>
              </div>

              <div className="relative z-10 mt-10 bg-white/10 border border-white/10 rounded-3xl p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={22} className="text-blue-200" />
                  <p className="font-bold text-sm">
                    Login gives you access to dashboard, bookings,
                    notifications, and account settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 flex items-center">
              <div className="w-full max-w-lg mx-auto">
                <div className="mb-8">
                  <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-5">
                    <LogIn size={28} />
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                    Sign In
                  </h2>

                  <p className="text-gray-500 mt-3 font-medium">
                    Enter your email and password to access your account.
                  </p>
                </div>

                {message && (
                  <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm font-semibold">
                    {message}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <InputWithIcon
                    label="Email Address"
                    icon={<Mail className="w-5 h-5" />}
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <PasswordInput
                    label="Password"
                    show={showPassword}
                    setShow={setShowPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />

                  <div className="flex items-center justify-between gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                        Remember me
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => navigate("/forgot-password")}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-extrabold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 disabled:opacity-60"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-gray-500 font-medium">
                    New to Ice Dome?{" "}
                    <button
                      onClick={() => navigate("/register")}
                      className="text-blue-600 font-extrabold hover:underline"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t px-8 py-10">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <FooterItem
            icon={<ShieldCheck />}
            title="Secure Login"
            desc="Your account is protected."
          />
          <FooterItem
            icon={<Clock />}
            title="Booking Access"
            desc="View your skating sessions."
          />
          <FooterItem
            icon={<Headset />}
            title="Support"
            desc="We are here to help."
          />
          <FooterItem
            icon={<CreditCard />}
            title="Payment History"
            desc="Track your payments safely."
          />
        </div>
      </footer>
    </div>
  );
};

const InputWithIcon = ({
  label,
  icon,
  type,
  placeholder,
  value,
  onChange,
  required,
}) => (
  <div className="space-y-2">
    <label className="block text-xs uppercase tracking-[0.15em] font-bold text-gray-400 ml-1">
      {label}
    </label>

    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
        {icon}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800"
      />
    </div>
  </div>
);

const PasswordInput = ({
  label,
  show,
  setShow,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-2">
    <label className="block text-xs uppercase tracking-[0.15em] font-bold text-gray-400 ml-1">
      {label}
    </label>

    <div className="relative group">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />

      <input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-800"
      />

      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

const InfoItem = ({ icon, title, desc }) => (
  <div className="flex gap-5 items-start group">
    <div className="bg-white/10 group-hover:bg-white/20 p-3 rounded-2xl text-white transition-all duration-300">
      {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
    </div>

    <div>
      <h3 className="font-bold text-xl leading-tight">{title}</h3>
      <p className="text-blue-100/80 text-sm leading-relaxed mt-1">{desc}</p>
    </div>
  </div>
);

const FooterItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-5 group p-2">
    <div className="text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white p-4 rounded-2xl transition-all duration-300">
      {React.cloneElement(icon, { size: 28 })}
    </div>

    <div>
      <p className="font-extrabold text-gray-900 text-base">{title}</p>
      <p className="text-gray-500 text-sm font-medium mt-0.5">{desc}</p>
    </div>
  </div>
);

export default LoginPage;

