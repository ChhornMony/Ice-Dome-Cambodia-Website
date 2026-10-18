"use client";
import React from 'react';
import { Mail, Lock, Eye, Calendar, Ticket, Star, ShieldCheck, Clock, Headset, CreditCard } from 'lucide-react';
import Navbar from '@/components/common/navbar';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />

      {/* Main Content: Removed container/max-w to achieve full-width split */}
      <main className="w-full flex-grow flex flex-row pt-16 lg:pt-20 overflow-hidden">
        
        {/* LEFT COLUMN: Hero Banner (Full 50% width) */}
        <div className="w-1/2 relative bg-blue-900 flex items-center justify-center">
          {/* Using a darker overlay or image to match the "Ice Dome" theme */}
          <img 
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" 
            alt="Ice Skating" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          
          <div className="relative z-10 w-full max-w-lg px-12 py-12 text-white">
            <h1 className="text-5xl font-extrabold mb-4 tracking-tight leading-tight">
              Welcome Back!
            </h1>
            <p className="text-lg text-blue-100 mb-12 opacity-90 leading-relaxed">
              Login to manage your bookings, view your tickets, and more.
            </p>
            
            <div className="space-y-10">
              <InfoItem icon={<Calendar />} title="Manage Bookings" desc="View, reschedule or cancel your bookings easily." />
              <InfoItem icon={<Ticket />} title="Your Tickets" desc="Access your e-tickets and booking history." />
              <InfoItem icon={<Star />} title="Exclusive Offers" desc="Get special deals and updates just for members." />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Login Area (Full 50% width) */}
        <div className="w-1/2 flex items-center justify-center bg-gray-50/50 px-12">
          {/* Floating White Card to match image */}
          <div className="w-full max-w-md bg-white p-12 rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
            <div className="mb-10 text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Login to Your Account</h2>
              <p className="text-gray-500 mt-2 font-medium">Welcome back! Please enter your details.</p>
            </div>
            
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 w-5 h-5 transition-colors" />
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 w-5 h-5 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Forgot password?</a>
              </div>

              <button className="w-full bg-[#0052FF] text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                Login
              </button>
            </form>

            <div className="relative my-10 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <span className="relative px-4 bg-white text-sm text-gray-400 font-medium">or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SocialBtn provider="Google" icon={<img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt=""/>} />
              <SocialBtn provider="Facebook" icon={<img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt=""/>} />
            </div>

            <p className="text-center mt-10 text-gray-500 font-medium">
              Don't have an account? <a href="#" className="text-blue-600 font-bold hover:underline ml-1">Sign up</a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer: Full width with border separators */}
      <footer className="bg-white border-t py-8 px-12">
        <div className="w-full grid grid-cols-4 gap-4">
          <FooterItem icon={<ShieldCheck />} title="Secure Booking" desc="Your data is safe with us" />
          <FooterItem icon={<Clock />} title="Free Cancellation" desc="Up to 24 hours before session" />
          <FooterItem icon={<Headset />} title="24/7 Support" desc="We're here to help" />
          <FooterItem icon={<CreditCard />} title="Secure Payment" desc="Encrypted & trusted" />
        </div>
      </footer>
    </div>
  );
};

// --- Sub-components ---

const InfoItem = ({ icon, title, desc }) => (
  <div className="flex gap-6 items-start">
    <div className="bg-white p-3 rounded-full text-blue-600 shadow-lg">
      {React.cloneElement(icon, { size: 24, strokeWidth: 2.5 })}
    </div>
    <div className="space-y-1">
      <h3 className="font-bold text-xl text-white">{title}</h3>
      <p className="text-blue-100 text-sm leading-snug">{desc}</p>
    </div>
  </div>
);

const SocialBtn = ({ provider, icon }) => (
  <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700 text-sm shadow-sm">
    {icon} {provider}
  </button>
);

const FooterItem = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 px-6 border-r last:border-0 border-gray-100">
    <div className="text-blue-600">
      {React.cloneElement(icon, { size: 32 })}
    </div>
    <div>
      <p className="font-bold text-gray-900 text-sm">{title}</p>
      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
    </div>
  </div>
);

export default LoginPage;