"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Lock,
  ShieldCheck,
  Truck,
  RotateCcw,
  QrCode,
  Loader2,
  X,
  User,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@/lib/router";
import Navbar from "@/components/common/navbar";
import { useCart } from "@/context/useCart";

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const safeReadJson = async (response) => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { success: false, message: text || "Invalid server response." };
  }
};

const CartPage = () => {
  const { cartItems, updateQty, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrPayment, setQrPayment] = useState(null);
  const [checkingPayment, setCheckingPayment] = useState(false);
  const [paymentCheckMessage, setPaymentCheckMessage] = useState("");

  // --- Delivery details ---
  const [delivery, setDelivery] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/login");
    }
  }, [navigate]);

  const handleDeliveryChange = (field) => (e) => {
    setDelivery((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const redirectToSuccess = useCallback(
    ({ order, payment, orderId }) => {
      setQrModalOpen(false);
      setPaymentCheckMessage("");
      clearCart();

      toast.success("Payment successful! You have successfully bought your items.");

      navigate("/payment-success", {
        state: { order, payment, orderId },
      });
    },
    [navigate, clearCart]
  );

  const createOrder = async () => {
    const token = getToken();
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/login");
      throw new Error("You are not logged in. Please login again.");
    }
    if (!cartItems.length) {
      throw new Error("Your cart is empty.");
    }

    const response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: cartItems.map(({ id, size, qty }) => ({
          productId: id,
          size,
          quantity: qty,
        })),
        delivery: {
          name: delivery.name || null,
          phone: delivery.phone || null,
          address: delivery.address || null,
          notes: delivery.notes || null,
        },
      }),
    });

    const result = await safeReadJson(response);
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create order.");
    }
    return result.data.order;
  };

  // --- Create static QR payment ---
  const createQRPayment = async (orderId) => {
    const token = getToken();
    if (!token) {
      localStorage.setItem("redirectAfterLogin", "/cart");
      navigate("/login");
      throw new Error("You are not logged in. Please login again.");
    }

    const response = await fetch(`${API_URL}/api/payments/qr/create`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    });

    const result = await safeReadJson(response);
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to create payment.");
    }
    return result.data;
  };

  const checkPaymentStatus = useCallback(
    async (manual = true) => {
      try {
        if (!qrPayment?.paymentId) return;

        if (manual) {
          setCheckingPayment(true);
          setPaymentCheckMessage("");
          setPaymentError("");
        }

        const token = getToken();
        if (!token) {
          localStorage.setItem("redirectAfterLogin", "/cart");
          navigate("/login");
          throw new Error("You are not logged in. Please login again.");
        }

        const response = await fetch(
          `${API_URL}/api/payments/qr/check/${qrPayment.paymentId}?t=${Date.now()}`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          }
        );

        const result = await safeReadJson(response);
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to check payment.");
        }

        const paid =
          result.paid === true ||
          result.data?.status === "PAID" ||
          result.data?.payment?.status === "PAID";

        if (paid) {
          redirectToSuccess({
            order: result.data?.order || null,
            payment: result.data?.payment || null,
            orderId:
              result.orderId ||
              result.data?.order?.id ||
              result.data?.payment?.orderId ||
              qrPayment.orderId,
          });
          return;
        }

        if (manual) {
          setPaymentCheckMessage("Payment not detected yet. Please wait a few seconds and try again.");
        }
      } catch (error) {
        if (manual) {
          setPaymentError(error.message || "Payment check failed.");
        }
      } finally {
        if (manual) {
          setCheckingPayment(false);
        }
      }
    },
    [qrPayment, getToken, navigate, redirectToSuccess]
  );

  useEffect(() => {
    if (!qrModalOpen || !qrPayment?.paymentId) return;

    const delay = 6000;
    const timeout = setTimeout(() => checkPaymentStatus(false), delay);
    const interval = setInterval(() => checkPaymentStatus(false), delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [qrModalOpen, qrPayment?.paymentId, checkPaymentStatus]);

  const handlePayment = async () => {
    try {
      setPaymentError("");
      setPaymentCheckMessage("");
      setPaying(true);

      const token = getToken();
      if (!token) {
        localStorage.setItem("redirectAfterLogin", "/cart");
        navigate("/login");
        throw new Error("You are not logged in. Please login again.");
      }
      if (!cartItems.length) {
        throw new Error("Your cart is empty.");
      }

      const order = await createOrder();
      const paymentData = await createQRPayment(order.id);

      setQrPayment(paymentData);
      setQrModalOpen(true);
    } catch (error) {
      setPaymentError(error.message || "Payment failed.");
    } finally {
      setPaying(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/shop");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />

      {/* --- QR CODE MODAL --- */}
      {qrModalOpen && qrPayment && (
        <div className="fixed inset-0 z-[1000] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-6 relative">
            <button
              type="button"
              onClick={() => setQrModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <QrCode size={28} />
              </div>

              <h2 className="text-2xl font-black text-gray-900">Scan to Pay</h2>

              <p className="mt-2 text-sm font-semibold text-gray-500">
                Open Bakong, ABA, ACLEDA, Wing, or any KHQR supported app and scan this QR.
              </p>

              <div className="mt-5 rounded-3xl border border-gray-100 bg-gray-50 p-4">
                <img
                  src={qrPayment.qrImage}
                  alt="Payment QR"
                  className="w-72 h-72 object-contain mx-auto rounded-2xl bg-white"
                />
              </div>

              <div className="mt-5 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                  Amount to pay (exact)
                </p>
                <p className="text-3xl font-black text-blue-900">
                  ${Number(qrPayment.amount).toFixed(2)}
                </p>
              </div>

              {paymentCheckMessage && (
                <div className="mt-4 rounded-2xl bg-yellow-50 border border-yellow-100 px-4 py-3">
                  <p className="text-xs font-bold text-yellow-700">{paymentCheckMessage}</p>
                </div>
              )}

              {paymentError && (
                <div className="mt-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-xs font-bold text-red-700">{paymentError}</p>
                </div>
              )}

              <p className="mt-3 text-xs font-semibold text-gray-400">
                This page checks payment automatically every 6 seconds. After payment is confirmed, you will go to the success page automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto max-w-7xl px-4 md:px-8 pt-24 lg:pt-32 pb-20 flex-grow">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <p className="text-blue-600 font-bold text-xs uppercase tracking-widest">
              Shopping Cart
            </p>
            <h1 className="text-4xl font-black text-gray-900 mb-2">Your Cart</h1>
            <p className="text-gray-500 text-sm">
              Review your items and proceed to secure checkout.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <ShieldCheck size={20} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-gray-900">Secure Checkout</p>
              <p className="text-[11px] text-gray-400">Your information is safe with us.</p>
            </div>
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="hidden md:grid grid-cols-12 p-6 border-b border-gray-300 text-[11px] font-bold uppercase tracking-widest text-black">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div className="divide-y divide-gray-50">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="p-6 grid grid-cols-1 md:grid-cols-12 items-center gap-4"
                    >
                      <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 p-3">
                          <img src={item.img} alt={item.name} className="w-full h-full object-contain" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-bold text-gray-900 text-base">{item.name}</h3>
                          <p className="text-xs text-gray-400 font-medium">Size: {item.size}</p>
                          <div className="flex items-center gap-2 text-green-500 text-[11px] font-bold uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            In Stock
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="flex items-center gap-1.5 text-red-400 hover:text-red-500 transition-colors text-[11px] font-bold uppercase"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 text-center font-bold text-gray-900">
                        ${item.price.toFixed(2)}
                      </div>

                      <div className="col-span-1 md:col-span-2 flex justify-center">
                        <div className="flex items-center border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                          <button
                            onClick={() => updateQty(item.id, item.size, -1)}
                            className="p-2.5 hover:bg-white transition-colors text-gray-400"
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) => {
                              const raw = e.target.value;
                              if (raw === "") return;
                              const parsed = parseInt(raw, 10);
                              if (isNaN(parsed)) return;
                              const nextQty = Math.max(1, parsed);
                              const delta = nextQty - item.qty;
                              if (delta !== 0) {
                                updateQty(item.id, item.size, delta);
                              }
                            }}
                            onBlur={(e) => {
                              const raw = e.target.value;
                              if (raw === "" || isNaN(parseInt(raw, 10))) {
                                e.target.value = item.qty;
                              }
                            }}
                            className="w-12 bg-transparent text-center font-bold text-sm outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => updateQty(item.id, item.size, 1)}
                            className="p-2.5 hover:bg-white transition-colors text-blue-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 text-right font-black text-gray-900 text-lg">
                        ${(item.price * item.qty).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all"
                >
                  <ArrowLeft size={16} /> Continue Shopping
                </button>
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 text-red-400 hover:text-red-500 text-sm font-bold transition-colors"
                >
                  <Trash2 size={16} /> Clear Cart
                </button>
              </div>

              {/* --- DELIVERY DETAILS SECTION --- */}
              <div className="mt-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <Truck size={18} className="text-blue-600" />
                  <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
                    Delivery Details
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide ml-1">
                    (Optional)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputWithIcon
                    icon={<User size={17} />}
                    type="text"
                    placeholder="Full Name"
                    value={delivery.name}
                    onChange={handleDeliveryChange("name")}
                  />
                  <InputWithIcon
                    icon={<Phone size={17} />}
                    type="tel"
                    placeholder="Phone Number"
                    value={delivery.phone}
                    onChange={handleDeliveryChange("phone")}
                  />
                  <div className="md:col-span-2">
                    <InputWithIcon
                      icon={<MapPin size={17} />}
                      type="text"
                      placeholder="Delivery Address"
                      value={delivery.address}
                      onChange={handleDeliveryChange("address")}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="relative">
                      <div className="absolute left-3.5 top-3.5 text-gray-300">
                        <FileText size={17} />
                      </div>
                      <textarea
                        placeholder="Notes (e.g. preferred delivery time, landmark)"
                        value={delivery.notes}
                        onChange={handleDeliveryChange("notes")}
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition resize-none"
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-gray-400">
                  These details help our team arrange pickup or delivery of your order.
                </p>
              </div>
              {/* --------------------------------- */}

              <div className="bg-gray-100 mt-8 p-4 rounded-2xl border border-gray-200">
                <div className="px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <p className="text-base font-black text-gray-900">100% Secure Shopping</p>
                      <p className="text-xs text-gray-400">
                        We protect your personal information and payment details with industry-leading security.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 grayscale opacity-50">
                    <div className="border p-2 rounded-lg font-bold text-xs italic bg-blue-600 text-white">
                      KHQR
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/3 space-y-6">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h2 className="text-xl font-black text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 text-sm font-medium border-b border-gray-50 pb-6">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="text-gray-900 font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Pickup / Delivery</span>
                    <span className="text-gray-900 font-bold text-xs">Arranged after purchase</span>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-black text-gray-900">Total</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        Includes VAT
                      </p>
                    </div>
                    <span className="text-3xl font-black text-blue-600">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment method: QR only */}
                <div className="mt-6">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Payment Method
                  </p>

                  <div className="border border-gray-100 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between gap-3 p-4 bg-blue-50/60">
                      <div className="flex items-center gap-3">
                        <QrCode size={17} className="text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">Scan QR to Pay</span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-1 rounded bg-blue-600 text-white shrink-0">
                        QR
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                    A QR code will appear for you to scan and pay using any KHQR-supported banking app.
                  </p>
                </div>

                {paymentError && (
                  <div className="mt-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                    <p className="text-xs font-bold text-red-700">{paymentError}</p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={paying || !cartItems.length}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black mt-6 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-50 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {paying ? <Loader2 size={18} className="animate-spin" /> : <QrCode size={18} />}
                  {paying ? "Creating QR..." : `Pay $${subtotal.toFixed(2)}`}
                </button>

                <p className="text-center text-[13px] text-gray-400 pt-5 flex items-center justify-center gap-1 font-bold">
                  <Lock size={14} /> Secure and encrypted payment
                </p>
              </div>

              <div className="space-y-4">
                <TrustBox
                  icon={<Truck size={24} />}
                  title="We'll Contact You"
                  desc="After purchase, our team will reach out about pickup or delivery of your order."
                />
                <TrustBox
                  icon={<RotateCcw size={24} />}
                  title="Check Before Use"
                  desc="Please confirm product size before pickup."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm py-20 text-center px-5">
            <ShoppingEmpty />
            <h3 className="text-xl font-black text-gray-900 mt-4">Your cart is empty</h3>
            <p className="text-gray-500 text-sm mt-2">Add products from the shop before checkout.</p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition"
            >
              Go to Shop
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const InputWithIcon = ({ icon, type, placeholder, value, onChange }) => (
  <div className="relative">
    <div className="absolute left-3.5 top-3.5 text-gray-300">{icon}</div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition"
    />
  </div>
);

const TrustBox = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className="text-blue-600 bg-blue-50 p-3 rounded-xl">{icon}</div>
    <div>
      <p className="text-sm font-bold text-gray-900">{title}</p>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  </div>
);

const ShoppingEmpty = () => (
  <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
    <Lock size={28} />
  </div>
);

export default CartPage;