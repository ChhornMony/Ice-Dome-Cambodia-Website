"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, Lock } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function CardDemoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bookingId = searchParams.get("bookingId");
  const orderId = searchParams.get("orderId");

  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [expiry, setExpiry] = useState("12/30");
  const [cvv, setCvv] = useState("123");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePay = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/payments/card-demo/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          orderId,
          cardNumber,
          expiry,
          cvv,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Payment failed");
        return;
      }

      router.push("/payment-success");
    } catch (error) {
      setMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <form
        onSubmit={handlePay}
        className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-100 p-8"
      >
        <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-5">
          <CreditCard size={32} />
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900">
          Demo Card Payment
        </h1>

        <p className="text-gray-500 mt-2 mb-6">
          Use this demo card for thesis defense testing.
        </p>

        {message && (
          <div className="mb-5 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
            {message}
          </div>
        )}

        <label className="block mb-4">
          <span className="text-sm font-bold text-gray-700">Card Number</span>
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </label>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <label>
            <span className="text-sm font-bold text-gray-700">Expiry</span>
            <input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>

          <label>
            <span className="text-sm font-bold text-gray-700">CVV</span>
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
            />
          </label>
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-900 text-white rounded-xl py-4 font-extrabold hover:bg-blue-800 transition disabled:opacity-60"
        >
          {loading ? "Processing..." : "Pay Demo Card"}
        </button>

        <div className="flex items-center gap-2 text-xs text-gray-400 mt-5">
          <Lock size={14} />
          Demo only. No real card payment is processed.
        </div>
      </form>
    </div>
  );
}

export default function CardDemoPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading payment page...</div>}>
      <CardDemoContent />
    </Suspense>
  );
}