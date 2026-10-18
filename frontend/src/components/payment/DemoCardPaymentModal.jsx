"use client";

import { useState } from "react";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  Lock,
  X,
  Receipt,
  Printer,
} from "lucide-react";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

export default function DemoCardPaymentModal({
  open,
  onClose,
  bookingId,
  orderId,
  amount = 0,
  onSuccess,
  onDone,
}) {
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1111");
  const [expiry, setExpiry] = useState("12/30");
  const [cvv, setCvv] = useState("123");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [receiptData, setReceiptData] = useState(null);

  if (!open) return null;

  const resetModal = () => {
    setMessage("");
    setReceiptData(null);
  };

  const closeModal = () => {
    resetModal();
    onClose();
  };

  const handleDone = () => {
    resetModal();

    if (onDone) {
      onDone();
      return;
    }

    onClose();
  };

  const printReceipt = () => {
    window.print();
  };

  const handlePay = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        return;
      }

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
        setMessage(result.message || "Payment failed.");
        return;
      }

      const data = result.data || {};
      const payment = data.payment || {};

      setReceiptData({
        paymentId: payment.id || "N/A",
        transactionId: payment.transactionId || `CARD-DEMO-${Date.now()}`,
        amount: payment.amount ?? amount,
        currency: payment.currency || "USD",
        status: payment.status || "PAID",
        paidAt: payment.paidAt || new Date().toISOString(),
        type: orderId || data.orderId ? "Shop Order" : "Ticket Booking",
        bookingId: data.bookingId || data.booking?.id || bookingId || null,
        orderId: data.orderId || data.order?.id || orderId || null,
        last4: cardNumber.replace(/\s/g, "").slice(-4),
      });

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      setMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
        >
          <X size={18} />
        </button>

        {receiptData ? (
          <div className="py-3">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-green-50 text-green-600 flex items-center justify-center mb-5">
                <CheckCircle size={44} />
              </div>

              <h2 className="text-3xl font-black text-gray-900">
                Payment Successful
              </h2>

              <p className="text-gray-500 mt-2">
                Your card payment has been completed successfully.
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-gray-200 bg-gray-50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Receipt size={20} className="text-blue-600" />
                <h3 className="font-black text-gray-900">Payment Receipt</h3>
              </div>

              <ReceiptRow label="Payment Type" value={receiptData.type} />

              <ReceiptRow
                label="Reference"
                value={receiptData.bookingId || receiptData.orderId}
              />

              <ReceiptRow label="Payment ID" value={receiptData.paymentId} />

              <ReceiptRow
                label="Transaction ID"
                value={receiptData.transactionId}
              />

              <ReceiptRow
                label="Card"
                value={`**** **** **** ${receiptData.last4}`}
              />

              <ReceiptRow
                label="Paid At"
                value={new Date(receiptData.paidAt).toLocaleString()}
              />

              <ReceiptRow label="Status" value={receiptData.status} />

              <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                <span className="font-black text-gray-900">Total Paid</span>

                <span className="text-2xl font-black text-blue-700">
                  ${Number(receiptData.amount || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={printReceipt}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-black hover:bg-gray-200 transition flex items-center justify-center gap-2"
              >
                <Printer size={17} />
                Print
              </button>

              <button
                type="button"
                onClick={handleDone}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay}>
            <div className="w-16 h-16 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-5">
              <CreditCard size={32} />
            </div>

            <h2 className="text-2xl font-black text-gray-900">
              Card Payment
            </h2>

            <p className="text-gray-500 mt-2 mb-5">
              Enter card details to complete payment.
            </p>

            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 mb-5">
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                Amount
              </p>

              <p className="text-3xl font-black text-blue-900">
                ${Number(amount || 0).toFixed(2)}
              </p>
            </div>

            {message && (
              <div className="mb-5 rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
                {message}
              </div>
            )}

            <label className="block mb-4">
              <span className="text-sm font-bold text-gray-700">
                Card Number
              </span>

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
              className="w-full bg-blue-600 text-white rounded-xl py-4 font-black hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Processing..." : "Pay Card"}
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-5">
              <Lock size={14} />
              Secure card payment.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const ReceiptRow = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-2 border-b border-gray-200 last:border-0">
    <span className="text-xs font-bold text-gray-400 uppercase">{label}</span>

    <span className="text-xs font-black text-gray-900 text-right break-all">
      {value || "N/A"}
    </span>
  </div>
);