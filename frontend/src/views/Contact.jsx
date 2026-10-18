"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  CalendarCheck,
  Users,
  Handshake,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/common/navbar";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "General Inquiry",
    message: "",
    consent: false,
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatusMessage("");
    setStatusType("");

    if (!form.name.trim()) {
      setStatusType("error");
      setStatusMessage("Please enter your name.");
      return;
    }

    if (!form.email.trim()) {
      setStatusType("error");
      setStatusMessage("Please enter your email address.");
      return;
    }

    if (!form.message.trim()) {
      setStatusType("error");
      setStatusMessage("Please enter your message.");
      return;
    }

    if (!form.consent) {
      setStatusType("error");
      setStatusMessage("Please agree to the Privacy Policy and Terms.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          inquiryType: form.inquiryType,
          message: form.message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to send message.");
      }

      setStatusType("success");
      setStatusMessage(
        "Message sent successfully. Our team will contact you soon."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        inquiryType: "General Inquiry",
        message: "",
        consent: false,
      });
    } catch (error) {
      setStatusType("error");
      setStatusMessage(
        error.message ||
          "Failed to send message. Please try again or contact us directly."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[450px] overflow-hidden flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000"
            alt="Ice Dome Rink"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/90 to-white/50 md:to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-12">
          <div className="max-w-2xl">
            <p className="text-blue-600 font-bold uppercase tracking-[0.22em] text-[10px] md:text-xs mb-3">
              Contact Us
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4 md:mb-6">
              We&apos;d Love To Hear From You!
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mb-6 md:mb-8 font-medium leading-relaxed max-w-xl">
              Have a question, feedback, or need assistance? Our team is here to
              help with bookings, events, partnerships, and general inquiries.
            </p>

            <a
              href="#contact-form"
              className="inline-flex bg-[#0052FF] text-white px-6 py-3.5 rounded-2xl font-bold text-sm items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
            >
              <Mail size={18} />
              Send Us a Message
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50/70 py-10 sm:py-14 md:py-20">
        <div className="px-4 sm:px-6 md:px-12 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Contact Details */}
            <div className="lg:col-span-3 flex flex-col w-full">
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex-grow">
                <div className="divide-y divide-gray-100 h-full flex flex-col">
                  <ContactInfoRow
                    icon={<MapPin size={18} className="text-white" />}
                    title="Visit Us"
                    content="CCV new operation Phnom Penh, Cambodia"
                  />

                  <ContactInfoRow
                    icon={<Phone size={18} className="text-white" />}
                    title="Call Us"
                    content={["+855 12 345 678", "+855 98 765 432"]}
                    footer="Mon – Sun: 10:00 AM – 10:00 PM"
                  />

                  <ContactInfoRow
                    icon={<Mail size={18} className="text-white" />}
                    title="Email Us"
                    content={[
                      "info@icedomecambodia.com",
                      "booking@icedomecambodia.com",
                    ]}
                  />

                  <ContactInfoRow
                    icon={<Clock size={18} className="text-white" />}
                    title="Operating Hours"
                    content={[
                      "Tue – Fri: 12:30 PM – 7:30 PM",
                      "Sat – Sun: 10:30 AM – 9:30 PM",
                    ]}
                    footer="Open everyday including holidays"
                  />
                </div>
              </div>
            </div>

            {/* Message Form */}
            <div id="contact-form" className="lg:col-span-6 flex flex-col w-full">
              <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 md:p-10 shadow-sm flex-grow">
                <div className="mb-7 sm:mb-8">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.22em] mb-2">
                    Message
                  </p>

                  <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                    Send Us a Message
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 font-medium">
                    Fill out the form and our team will get back to you soon.
                  </p>
                </div>

                {statusMessage && (
                  <div
                    className={`mb-5 rounded-2xl px-4 py-3 text-sm font-semibold flex items-start gap-3 ${
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

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      label="Your Name *"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={(value) => handleChange("name", value)}
                    />

                    <FormField
                      label="Email Address *"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(value) => handleChange("email", value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField
                      label="Phone Number"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={(value) => handleChange("phone", value)}
                    />

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Inquiry Type
                      </label>

                      <select
                        value={form.inquiryType}
                        onChange={(e) =>
                          handleChange("inquiryType", e.target.value)
                        }
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 focus:border-blue-500 outline-none transition-all"
                      >
                        <option>General Inquiry</option>
                        <option>Session Booking</option>
                        <option>Group Booking</option>
                        <option>Birthday Party / Event</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Message *
                    </label>

                    <textarea
                      rows="5"
                      value={form.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none resize-none transition-all"
                    />

                    <p className="text-xs text-gray-400 font-bold text-right">
                      {form.message.length} characters
                    </p>
                  </div>

                  <div className="flex items-start gap-2 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={form.consent}
                      onChange={(e) => handleChange("consent", e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 mt-0.5 cursor-pointer shrink-0"
                    />

                    <label
                      htmlFor="consent"
                      className="text-[11px] text-gray-500 font-medium cursor-pointer leading-relaxed"
                    >
                      I agree to the{" "}
                      <span className="text-blue-600 underline">
                        Privacy Policy
                      </span>{" "}
                      and{" "}
                      <span className="text-blue-600 underline">
                        Terms & Conditions
                      </span>
                      .
                    </label>
                  </div>

                  <button
                    disabled={loading}
                    className="w-full py-4 bg-[#0052FF] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 pt-1 text-center">
                    <CheckCircle2 size={13} className="text-blue-400 shrink-0" />
                    <span>We typically reply within 24 hours.</span>
                  </div>
                </form>
              </div>
            </div>

            {/* Find Us */}
            <div className="lg:col-span-3 flex flex-col w-full">
              <div className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 md:p-8 shadow-sm flex-grow">
                <h2 className="text-xl font-black mb-5 sm:mb-6 text-gray-900">
                  Find Us
                </h2>

                <a
                  href="https://maps.app.goo.gl/qLaiLXXMqL2gNCg39"
                  target="_blank"
                  rel="noreferrer"
                  className="block"
                >
                  <div className="rounded-2xl overflow-hidden border border-gray-100 h-52 md:h-56 mb-7 relative shrink-0 group">
                    <img
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000"
                      alt="Map"
                      className="w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex flex-col items-center">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white shadow-sm" />
                        <p className="text-[9px] font-black mt-2 text-gray-800 uppercase tracking-wide">
                          Ice Dome Cambodia
                        </p>
                      </div>
                    </div>
                  </div>
                </a>

                <div className="space-y-4">
                  <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-widest">
                    Get in Touch for
                  </h3>

                  <div className="space-y-3">
                    <GetInTouchItem
                      icon={<Mail size={14} />}
                      text="General Inquiries"
                    />
                    <GetInTouchItem
                      icon={<CalendarCheck size={14} />}
                      text="Session Bookings"
                    />
                    <GetInTouchItem
                      icon={<Users size={14} />}
                      text="Group & School Bookings"
                    />
                    <GetInTouchItem
                      icon={<CheckCircle2 size={14} />}
                      text="Birthday Parties & Events"
                    />
                    <GetInTouchItem
                      icon={<Handshake size={14} />}
                      text="Partnerships & Sponsorships"
                    />
                  </div>
                </div>

                <div className="mt-7 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={18} className="text-blue-600 shrink-0" />
                    <p className="text-xs font-semibold text-blue-700 leading-relaxed">
                      For urgent booking support, please call us directly during
                      operating hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Quick Contact */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:hidden">
            <QuickAction
              icon={<Phone size={18} />}
              title="Call"
              desc="+855 12 345 678"
            />
            <QuickAction
              icon={<Mail size={18} />}
              title="Email"
              desc="info@icedomecambodia.com"
            />
            <QuickAction
              icon={<Clock size={18} />}
              title="Hours"
              desc="Open everyday"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FormField = ({ label, type, placeholder, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
      {label}
    </label>

    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
    />
  </div>
);

const ContactInfoRow = ({ icon, title, content, footer, link }) => (
  <div className="p-5 md:p-7 flex-grow">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 shrink-0 bg-[#0052FF] rounded-2xl flex items-center justify-center shadow-md shadow-blue-50">
        {icon}
      </div>

      <div className="pt-0.5 min-w-0">
        <h4 className="text-sm font-bold text-gray-900 mb-1">{title}</h4>

        <div className="space-y-0.5">
          {Array.isArray(content) ? (
            content.map((line, i) => (
              <p
                key={i}
                className="text-xs font-medium text-gray-500 break-words"
              >
                {line}
              </p>
            ))
          ) : (
            <p className="text-xs font-medium text-gray-500 leading-relaxed break-words">
              {content}
            </p>
          )}
        </div>

        {footer && (
          <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-tighter leading-relaxed">
            {footer}
          </p>
        )}

        {link && (
          <a
            href="#"
            className="text-[10px] font-bold text-blue-600 flex items-center gap-1 mt-3 hover:underline"
          >
            {link}
          </a>
        )}
      </div>
    </div>
  </div>
);

const GetInTouchItem = ({ text, icon }) => (
  <div className="flex items-center gap-3">
    <div className="text-blue-500 shrink-0">
      {icon || <CheckCircle2 size={14} />}
    </div>
    <span className="text-[12px] font-bold text-gray-600 leading-relaxed">
      {text}
    </span>
  </div>
);

const QuickAction = ({ icon, title, desc }) => (
  <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
      {icon}
    </div>

    <div className="min-w-0">
      <p className="text-sm font-black text-gray-900">{title}</p>
      <p className="text-xs font-medium text-gray-500 truncate">{desc}</p>
    </div>
  </div>
);

export default Contact;