import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import {
  Snowflake,
  Users,
  ShieldCheck,
  Ticket,
  ShoppingBag,
  MapPin,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="pt-28 pb-16">
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-950 to-blue-700 text-white p-8 md:p-12">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-200 mb-4">
                About Ice Dome Cambodia
              </p>

              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                Cambodia’s Modern Ice Skating Destination
              </h1>

              <p className="text-blue-100 mt-5 max-w-3xl text-base md:text-lg leading-relaxed font-medium">
                Ice Dome Cambodia is a place for families, students, beginners,
                and skating lovers to enjoy ice skating, book sessions online,
                and find skating equipment in one convenient place.
              </p>
            </div>

            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">
                  Our Mission
                </h2>

                <p className="text-gray-600 leading-relaxed font-medium">
                  Our mission is to make ice skating easier, safer, and more
                  enjoyable in Cambodia. We provide clear ticket booking,
                  organized skating sessions, helpful customer support, and a
                  friendly environment for all visitors.
                </p>

                <p className="text-gray-600 leading-relaxed font-medium mt-4">
                  Whether you are booking a weekday session, weekend session,
                  group activity, birthday event, or buying skating equipment,
                  Ice Dome Cambodia is built to give you a smooth experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureCard
                  icon={<Snowflake />}
                  title="Ice Skating"
                  desc="Fun skating sessions for all levels."
                />

                <FeatureCard
                  icon={<Ticket />}
                  title="Online Booking"
                  desc="Easy ticket booking and checkout."
                />

                <FeatureCard
                  icon={<ShoppingBag />}
                  title="Proshop"
                  desc="Skates, hockey gear, and accessories."
                />

                <FeatureCard
                  icon={<ShieldCheck />}
                  title="Safe Experience"
                  desc="Clear rules and secure booking."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          <InfoBox
            icon={<Users />}
            title="For Everyone"
            desc="Families, students, friends, and beginners are welcome."
          />

          <InfoBox
            icon={<MapPin />}
            title="Located in Phnom Penh"
            desc="Visit Ice Dome Cambodia for skating, events, and equipment."
          />

          <InfoBox
            icon={<ShieldCheck />}
            title="Customer Support"
            desc="Our team helps with bookings, events, and general questions."
          />
        </section>
      </main>

      
    </div>
  );
}

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-gray-50 border border-gray-100 rounded-3xl p-5">
    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
      {icon}
    </div>

    <h3 className="font-black text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
      {desc}
    </p>
  </div>
);

const InfoBox = ({ icon, title, desc }) => (
  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
      {icon}
    </div>

    <h3 className="text-xl font-black text-gray-900">{title}</h3>
    <p className="text-sm text-gray-500 mt-2 font-medium leading-relaxed">
      {desc}
    </p>
  </div>
);