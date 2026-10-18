"use client";

import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/common/navbar";
import { useNavigate } from "@/lib/router";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const getResetToken = () => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatusMessage("");
    setStatusType("");

    const token = getResetToken();

    if (!token) {
      setStatusType("error");
      setStatusMessage("Reset token is missing.");
      return;
    }

    if (password.length < 6) {
      setStatusType("error");
      setStatusMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setStatusType("error");
      setStatusMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to reset password.");
      }

      setStatusType("success");
      setStatusMessage("Password reset successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setStatusType("error");
      setStatusMessage(error.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex flex-col font-sans">
      <Navbar />

      <main className="w-full flex-grow pt-28 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          <button
            onClick={() => navigate("/login")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft size={17} />
            Back to Login
          </button>

          <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 p-7 sm:p-10">
            <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-5">
              <ShieldCheck size={28} />
            </div>

            <h1 className="text-3xl font-black text-gray-900">
              Reset Password
            </h1>

            <p className="text-gray-500 mt-3 font-medium leading-relaxed">
              Create a new password for your Ice Dome Cambodia account.
            </p>

            {statusMessage && (
              <div
                className={`mt-6 rounded-2xl px-4 py-3 text-sm font-semibold flex items-start gap-3 ${
                  statusType === "error"
                    ? "bg-red-50 text-red-700 border border-red-100"
                    : "bg-green-50 text-green-700 border border-green-100"
                }`}
              >
                {statusType === "error" ? (
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                )}

                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <PasswordField
                label="New Password"
                value={password}
                onChange={setPassword}
                show={showPassword}
                setShow={setShowPassword}
              />

              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                show={showPassword}
                setShow={setShowPassword}
              />

              <button
                disabled={loading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-extrabold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

const PasswordField = ({ label, value, onChange, show, setShow }) => (
  <div className="space-y-2">
    <label className="block text-xs uppercase tracking-[0.15em] font-bold text-gray-400 ml-1">
      {label}
    </label>

    <div className="relative group">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />

      <input
        type={show ? "text" : "password"}
        placeholder="Enter new password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
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