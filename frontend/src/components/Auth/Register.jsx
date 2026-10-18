"use client";

import React, { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ShieldCheck,
  Clock,
  Headset,
  CreditCard,
  UserPlus,
  Sparkles,
  CheckCircle2,
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

const RegisterPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Password and confirm password do not match.");
      return;
    }

    if (!agree) {
      setMessage("Please agree to the Terms and Privacy Policy.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Registration failed. Please try again.");
        return;
      }

      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      navigate("/dashboard");
    } catch (error) {
      console.error("REGISTER ERROR:", error);
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
                  Join Ice Dome Today
                </h1>

                <p className="text-blue-100 text-lg leading-relaxed mb-10 max-w-md">
                  Create your account to book skating sessions, manage your
                  tickets, receive updates, and enjoy a smoother booking
                  experience.
                </p>

                <div className="space-y-5">
                  <InfoItem
                    icon={<UserPlus />}
                    title="Easy Registration"
                    desc="Create your account in less than one minute."
                  />

                  <InfoItem
                    icon={<ShieldCheck />}
                    title="Secure Account"
                    desc="Your personal data and booking history are protected."
                  />

                  <InfoItem
                    icon={<Clock />}
                    title="Fast Booking"
                    desc="Book future sessions faster after signing in."
                  />
                </div>
              </div>

              <div className="relative z-10 mt-10 bg-white/10 border border-white/10 rounded-3xl p-5">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={22} className="text-blue-200" />
                  <p className="font-bold text-sm">
                    Your account helps you track bookings, orders, and updates.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="mb-8">
                <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-5">
                  <UserPlus size={28} />
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                  Create Account
                </h2>

                <p className="text-gray-500 mt-3 font-medium">
                  Fill in your details below to get started.
                </p>
              </div>

              {message && (
                <div className="mb-5 rounded-2xl bg-red-50 border border-red-100 text-red-700 px-4 py-3 text-sm font-semibold">
                  {message}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithIcon
                    label="First Name"
                    icon={<User className="w-5 h-5" />}
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />

                  <InputWithIcon
                    label="Last Name"
                    icon={<User className="w-5 h-5" />}
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <InputWithIcon
                  label="Email Address"
                  icon={<Mail className="w-5 h-5" />}
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <InputWithIcon
                  label="Phone Number"
                  icon={<Phone className="w-5 h-5" />}
                  type="tel"
                  placeholder="+855 12 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <PasswordInput
                    label="Password"
                    show={showPassword}
                    setShow={setShowPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                  />

                  <PasswordInput
                    label="Confirm Password"
                    show={showConfirm}
                    setShow={setShowConfirm}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                  />
                </div>

                <div className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />

                  <span className="text-sm text-gray-600 leading-snug">
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/terms-conditions")}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Terms & Conditions
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/privacy-policy")}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </div>

                <button
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-extrabold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 disabled:opacity-60"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500 font-medium">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-blue-600 font-extrabold hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t px-8 py-10">
        <div className="container max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <FooterItem
            icon={<ShieldCheck />}
            title="Secure Register"
            desc="Your account data is protected."
          />
          <FooterItem
            icon={<Clock />}
            title="Quick Booking"
            desc="Book sessions faster after login."
          />
          <FooterItem
            icon={<Headset />}
            title="Support"
            desc="We are here to help."
          />
          <FooterItem
            icon={<CreditCard />}
            title="Secure Payment"
            desc="Safe checkout experience."
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

export default RegisterPage;

