"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  ShoppingBag,
  User,
  CreditCard,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Bookings",
    path: "/dashboard/bookings",
    icon: CalendarCheck,
  },
  {
    name: "Shop Orders",
    path: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: User,
  },
  {
    name: "Payment History",
    path: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    name: "Notifications",
    path: "/dashboard/notifications",
    icon: Bell,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className="w-full lg:w-72 bg-white border border-gray-100 rounded-3xl shadow-sm p-4">
      <div className="px-4 py-4 border-b border-gray-100 mb-4">
        <h2 className="text-xl font-extrabold text-gray-900">
          My Account
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your Ice Dome account
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
                isActive
                  ? "bg-blue-900 text-white shadow-md"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-900"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-600 hover:bg-red-50 transition-all"
      >
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}