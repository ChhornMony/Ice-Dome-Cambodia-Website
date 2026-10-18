"use client";

import { useState } from "react";
import Navbar from "@/components/common/navbar";

import {
  HelpCircle,
  ChevronDown,
  Ticket,
  CreditCard,
  Calendar,
  ShieldCheck,
  ShoppingBag,
  MapPin,
} from "lucide-react";

const faqCategories = [
  {
    title: "Tickets & Booking",
    icon: Ticket,
    questions: [
      {
        question: "How do I book an ice skating ticket?",
        answer:
          "You can book a ticket by going to the Book Tickets page, selecting your preferred day, choosing a session time, adding any extras, and completing payment at checkout.",
      },
      {
        question: "Can I change my booking after purchase?",
        answer:
          "Rescheduling may only be allowed in special cases and depends on availability and company approval. Please contact Ice Dome Cambodia support as soon as possible if you need help.",
      },
      {
        question: "Do I need an account to book tickets?",
        answer:
          "Creating an account is recommended because it allows you to view your bookings, payment history, and receive booking updates.",
      },
    ],
  },
  {
    title: "Payments & Refunds",
    icon: CreditCard,
    questions: [
      {
        question: "What payment methods are accepted?",
        answer:
          "Ice Dome Cambodia may support online payment methods such as ABA, KHQR, cards, or other payment providers depending on what is available at checkout.",
      },
      {
        question: "Can I get a refund after buying a ticket?",
        answer:
          "No. Tickets are non-refundable after purchase. Please check your date, session time, ticket type, and quantity carefully before confirming payment.",
      },
      {
        question: "What should I do if my payment failed?",
        answer:
          "If your payment failed, please try again or contact support with your booking information and payment screenshot if money was deducted.",
      },
    ],
  },
  {
    title: "Sessions & Schedule",
    icon: Calendar,
    questions: [
      {
        question: "Where can I see the skating schedule?",
        answer:
          "You can view available sessions on the Pricing or Book Tickets page. Session times may change depending on holidays, private events, or maintenance.",
      },
      {
        question: "What happens if I arrive late?",
        answer:
          "Late arrival may reduce your skating time and does not qualify for a refund. Please arrive early enough for check-in and preparation.",
      },
      {
        question: "Can sessions be cancelled by Ice Dome Cambodia?",
        answer:
          "Yes. Sessions may be cancelled or changed due to maintenance, safety concerns, private events, or operational reasons. Ice Dome Cambodia may offer rescheduling or another solution based on company policy.",
      },
    ],
  },
  {
    title: "Safety & Venue Rules",
    icon: ShieldCheck,
    questions: [
      {
        question: "Do I need skating experience?",
        answer:
          "No. Beginners are welcome. However, all customers must follow safety rules and staff instructions while skating.",
      },
      {
        question: "Is safety equipment required?",
        answer:
          "Safety equipment may be recommended or required depending on age, skill level, and venue policy. Please follow staff instructions at the rink.",
      },
      {
        question: "Can children skate?",
        answer:
          "Yes, children may skate, but they should be supervised by a parent, guardian, or responsible adult when required.",
      },
    ],
  },
  {
    title: "Shop & Equipment",
    icon: ShoppingBag,
    questions: [
      {
        question: "Can I buy skating equipment online?",
        answer:
          "Yes. The shop page allows customers to browse equipment. Product availability, pickup, or delivery options may depend on company stock and policy.",
      },
      {
        question: "Can I return shop products?",
        answer:
          "Shop product returns or exchanges may follow separate product return rules depending on product condition, availability, and company approval.",
      },
    ],
  },
  {
    title: "Location & Contact",
    icon: MapPin,
    questions: [
      {
        question: "Where is Ice Dome Cambodia located?",
        answer:
          "Ice Dome Cambodia is located in Phnom Penh, Cambodia. You can check the Contact page or Google Maps link for directions.",
      },
      {
        question: "How can I contact support?",
        answer:
          "You can contact Ice Dome Cambodia through the Contact page, support email, or phone number listed on the website footer.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState("Tickets & Booking-0");

  const toggleItem = (categoryTitle, index) => {
    const key = `${categoryTitle}-${index}`;
    setOpenItem(openItem === key ? null : key);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="pt-28 pb-16">
        {/* Hero */}
        <section className="bg-blue-950 text-white">
          <div className="container mx-auto max-w-7xl px-6 py-16">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-5">
                <HelpCircle size={18} />
                <span className="text-sm font-bold uppercase tracking-widest">
                  Help Center
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                Frequently Asked Questions
              </h1>

              <p className="text-blue-100 text-lg mt-5 leading-relaxed">
                Find answers about ticket booking, payments, refunds, skating
                sessions, safety rules, shop orders, and Ice Dome Cambodia
                services.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="container mx-auto max-w-7xl px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Help Card */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-28">
                <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mb-5">
                  <HelpCircle size={30} />
                </div>

                <h2 className="text-2xl font-extrabold text-gray-900">
                  Need more help?
                </h2>

                <p className="text-gray-500 mt-3 leading-relaxed">
                  If you cannot find the answer you need, please contact our
                  support team. We will help you with bookings, payment issues,
                  tickets, and general questions.
                </p>

                <div className="mt-6 space-y-3">
                  <a
                    href="/contact"
                    className="block w-full text-center px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition"
                  >
                    Contact Support
                  </a>

                  <a
                    href="/tickets"
                    className="block w-full text-center px-6 py-3 bg-blue-50 text-blue-900 rounded-xl font-bold hover:bg-blue-100 transition"
                  >
                    Book Tickets
                  </a>
                </div>

                <div className="mt-8 border-t border-gray-100 pt-6">
                  <p className="text-sm font-bold text-gray-900">
                    Support hours
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Please check our Contact page for current support hours and
                    venue information.
                  </p>
                </div>
              </div>
            </aside>

            {/* FAQ List */}
            <div className="lg:col-span-2 space-y-8">
              {faqCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <section
                    key={category.title}
                    className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center">
                        <Icon size={26} />
                      </div>

                      <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">
                          {category.title}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                          Common questions about {category.title.toLowerCase()}.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {category.questions.map((item, index) => {
                        const key = `${category.title}-${index}`;
                        const isOpen = openItem === key;

                        return (
                          <div
                            key={key}
                            className="border border-gray-100 rounded-2xl overflow-hidden"
                          >
                            <button
                              onClick={() => toggleItem(category.title, index)}
                              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
                            >
                              <span className="font-extrabold text-gray-900">
                                {item.question}
                              </span>

                              <ChevronDown
                                size={20}
                                className={`text-gray-400 transition-transform ${
                                  isOpen ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {isOpen && (
                              <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                                {item.answer}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
}