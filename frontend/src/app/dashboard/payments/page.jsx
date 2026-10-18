"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { CreditCard, Receipt } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        return;
      }

      const response = await fetch(`${API_URL}/api/payments/my-payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Failed to load payment history.");
        return;
      }

      setPayments(result.data.payments || []);
    } catch (error) {
      console.error("FETCH PAYMENTS ERROR:", error);
      setMessage("Cannot connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <DashboardLayout
      title="Payment History"
      subtitle="View your payments, invoices, and refund status."
    >
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center">
            <CreditCard size={28} />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Payment History
            </h2>
            <p className="text-gray-500 mt-1">
              Your booking and shop payments will appear here.
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl bg-red-50 text-red-700 px-4 py-3 text-sm font-semibold">
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 font-medium">Loading payments...</p>
        ) : payments.length === 0 ? (
          <div className="rounded-2xl bg-gray-50 p-8 text-center">
            <Receipt size={60} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-extrabold text-gray-900">
              No payments yet
            </h3>
            <p className="text-gray-500 mt-2">
              Your payment history will appear here after booking or shopping.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b text-sm">
                    <td className="py-4 px-4">
                      {new Date(payment.createdAt).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-semibold">
                      {payment.type || "Payment"}
                    </td>
                    <td className="py-4 px-4 font-bold">
                      ${Number(payment.amount || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      {payment.method || "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-xs">
                        {payment.status || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}