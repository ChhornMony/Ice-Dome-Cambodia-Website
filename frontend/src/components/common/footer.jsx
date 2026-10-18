"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-blue-950 text-white">
      <div className="container mx-auto max-w-7xl px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/logo1.png"
              alt="Ice Dome Cambodia"
              className="w-12 h-12 object-contain bg-white rounded-full p-1"
            />

            <div>
              <h2 className="text-xl font-extrabold">ICE DOME</h2>
              <p className="text-xs tracking-[0.3em] text-blue-300 uppercase">
                Cambodia
              </p>
            </div>
          </div>

          <p className="text-blue-100 text-sm leading-relaxed">
            Cambodia’s ice skating destination for family fun, ticket booking,
            and skating equipment.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-extrabold text-lg mb-4">Quick Links</h3>

          <ul className="space-y-3 text-blue-100 text-sm">
            <li>
              <button
                onClick={() => router.push("/")}
                className="hover:text-white transition"
              >
                Home
              </button>
            </li>

            <li>
              <button
                onClick={() => router.push("/about")}
                className="hover:text-white transition"
              >
                About Us
              </button>
            </li>

            <li>
              <button
                onClick={() => router.push("/tickets")}
                className="hover:text-white transition"
              >
                Book Tickets
              </button>
            </li>

            <li>
              <button
                onClick={() => router.push("/pricing")}
                className="hover:text-white transition"
              >
                Pricing
              </button>
            </li>

            <li>
              <button
                onClick={() => router.push("/shop")}
                className="hover:text-white transition"
              >
                Shop
              </button>
            </li>

            <li>
              <button
                onClick={() => router.push("/contact")}
                className="hover:text-white transition"
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-extrabold text-lg mb-4">Support</h3>

          <ul className="space-y-3 text-blue-100 text-sm">
            <li>
              <button
                onClick={() => router.push("/privacy-policy")}
                className="hover:text-white transition"
              >
                Privacy Policy
              </button>
            </li>

            <li>
              <button
                onClick={() => router.push("/terms-conditions")}
                className="hover:text-white transition"
              >
                Terms & Conditions
              </button>
            </li>

            <li>
              <button
                onClick={() => router.push("/refund-policy")}
                className="hover:text-white transition"
              >
                Refund Policy
              </button>
            </li>

            <li>
              <button
                onClick={() => router.push("/faq")}
                className="hover:text-white transition"
              >
                FAQ
              </button>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-extrabold text-lg mb-4">Contact Us</h3>

          <div className="space-y-3 text-blue-100 text-sm">
            <p className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-blue-300 shrink-0" />
              <span>Ice Dome Cambodia, Phnom Penh, Cambodia</span>
            </p>

            <p className="flex items-center gap-3">
              <Phone size={18} className="text-blue-300 shrink-0" />
              +855 017750173
            </p>

            <p className="flex items-center gap-3">
              <Mail size={18} className="text-blue-300 shrink-0" />
              support@icedomecambodia.com
            </p>
          </div>

          <div className="flex gap-3 mt-5">
            <a
              href="https://www.facebook.com/p/Ice-Dome-Cambodia-61557482306569/"
              target="_blank"
              rel="noreferrer"
            >
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold transition">
                f
              </button>
            </a>

            { /*<button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center font-bold text-xs transition">
              IG
            </button> */ }

          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-blue-200 text-sm">
        © {new Date().getFullYear()} Ice Dome Cambodia. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;