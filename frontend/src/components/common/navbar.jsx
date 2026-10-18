"use client";

import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "@/lib/router";
import {
  ShoppingCart,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  CheckCheck,
  X,
  Menu,
  Home,
  Ticket,
  Tag,
  ShoppingBag,
  Phone,
} from "lucide-react";
import { useCart } from "@/context/useCart";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Book Tickets", path: "/tickets", icon: Ticket },
  { name: "Pricing", path: "/pricing", icon: Tag },
  { name: "Shop", path: "/shop", icon: ShoppingBag },
  { name: "Contact", path: "/contact", icon: Phone },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const bookingPaths = ["/tickets", "/choose-session", "/adds-on", "/checkout"];

  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);

  const visibleNotifications = notifications.filter((item) => !item.isRead);

  const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUserFromStorage();

    const handleStorageChange = () => {
      loadUserFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("userUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("userUpdated", handleStorageChange);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(`${API_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // --- SESSION EXPIRY CHECK (401) ---
      if (response.status === 401) {
        handleLogout(); // Force logout if backend says session expired
        return;
      }
      // ----------------------------------

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.data.user));
        setUser(result.data.user);
      }
    } catch (error) {
      console.log("Failed to fetch profile", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const response = await fetch(
        `${API_URL}/api/announcements/my-notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // --- SESSION EXPIRY CHECK (401) ---
      if (response.status === 401) {
        handleLogout(); // Force logout if backend says session expired
        return;
      }
      // ----------------------------------

      const result = await response.json();

      if (result.success) {
        setNotifications(result.data.notifications || []);
        setUnreadCount(result.data.unreadCount || 0);
      }
    } catch (error) {
      console.log("Failed to fetch notifications", error);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNotifications();

      // --- NEW: Live Polling for Notifications ---
      const interval = setInterval(() => {
        fetchNotifications();
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
      // ------------------------------------------
    }
  }, [user?.id]);



  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNotifications();
    }
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/announcements/mark-all-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setNotifications((prev) =>
          prev.map((item) => ({
            ...item,
            isRead: true,
          }))
        );

        setUnreadCount(0);
      }
    } catch (error) {
      console.log("Failed to mark notifications as read", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
    setProfileOpen(false);
    setNotificationOpen(false);
    setMobileMenuOpen(false);

    navigate("/login");
  };

  const getInitials = () => {
    if (!user) return "U";

    if (user.name) {
      return user.name
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    return user.email?.[0]?.toUpperCase() || "U";
  };

  const goTo = (path) => {
    setMobileMenuOpen(false);
    setNotificationOpen(false);
    setProfileOpen(false);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-3 sm:px-5 md:px-8 lg:px-12 py-3 md:py-4">
        {/* Logo */}
        <button
          onClick={() => goTo("/")}
          className="flex items-center gap-2 sm:gap-3 shrink-0"
        >
          <img
            src="/images/logo1.png"
            alt="Ice Dome Cambodia Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
          />

          <div className="flex flex-col text-left">
            <span className="font-black text-base sm:text-xl text-blue-900 leading-none tracking-wide">
              ICE DOME
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.25em] sm:tracking-[0.3em] font-bold text-blue-500 uppercase">
              Cambodia
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex gap-8">
          {navLinks.map((link) => {
            const isBookingActive =
              link.name === "Book Tickets" &&
              bookingPaths.includes(location.pathname);

            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-semibold transition-all duration-200 group ${isActive || isBookingActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${isActive || isBookingActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                        }`}
                    />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          {/* Notification Bell */}
          {user && (
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => {
                  setNotificationOpen((prev) => !prev);
                  setProfileOpen(false);
                  setMobileMenuOpen(false);
                }}
                className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
              >
                <Bell size={22} />

                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <NotificationDropdown
                  unreadCount={unreadCount}
                  visibleNotifications={visibleNotifications}
                  markAllRead={markAllRead}
                  close={() => setNotificationOpen(false)}
                  navigate={goTo}
                />
              )}
            </div>
          )}

          {/* Cart */}
          <button
            onClick={() => goTo("/cart")}
            className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
          >
            <ShoppingCart size={23} />

            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-black rounded-full min-w-5 h-5 px-1 flex items-center justify-center border-2 border-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Desktop Profile / Login */}
          <div className="hidden sm:block">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => {
                    setProfileOpen((prev) => !prev);
                    setNotificationOpen(false);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 md:gap-3 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-2xl pl-2 pr-3 md:pr-4 py-2 transition"
                >
                  <ProfileAvatar
                    user={user}
                    initials={getInitials()}
                    size="sm"
                  />

                  <div className="hidden md:block text-left max-w-[110px]">
                    <p className="text-sm font-black leading-none truncate">
                      {user.name || "User"}
                    </p>
                    <p className="text-[10px] font-bold text-blue-500 mt-1 uppercase truncate">
                      {user.role || "USER"}
                    </p>
                  </div>
                </button>

                {profileOpen && (
                  <ProfileDropdown
                    user={user}
                    initials={getInitials()}
                    goTo={goTo}
                    handleLogout={handleLogout}
                    markAllRead={markAllRead}
                    close={() => setProfileOpen(false)}
                  />
                )}
              </div>
            ) : (
              <button
                onClick={() => goTo("/login")}
                className="px-5 md:px-8 py-3 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-800 transition shadow-md active:scale-95 flex items-center gap-2"
              >
                <User size={18} />
                <span className="hidden md:inline">Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="relative lg:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => {
                setMobileMenuOpen((prev) => !prev);
                setNotificationOpen(false);
                setProfileOpen(false);
              }}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition flex items-center justify-center"
            >
              {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
            </button>

            {mobileMenuOpen && (
              <MobileMenu
                navLinks={navLinks}
                bookingPaths={bookingPaths}
                location={location}
                user={user}
                initials={getInitials()}
                goTo={goTo}
                handleLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NotificationDropdown = ({
  unreadCount,
  visibleNotifications,
  markAllRead,
  close,
  navigate,
}) => {
  return (
    <div className="fixed left-3 right-3 top-[74px] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-4 sm:w-[430px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="bg-blue-700 px-4 sm:px-5 py-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-blue-100">
              Your Notifications
            </p>
            <h3 className="text-base sm:text-lg font-black mt-1 truncate">
              {unreadCount > 0 ? `${unreadCount} New` : "No New Notifications"}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {visibleNotifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-bold bg-white/15 hover:bg-white/25 rounded-xl px-3 py-2 transition"
              >
                Clear All
              </button>
            )}

            <button
              onClick={close}
              className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-700 px-4 sm:px-5 flex gap-5 border-t border-white/10">
        <button className="text-xs font-extrabold text-white py-3 border-b-2 border-green-400">
          VIEW ALL
        </button>
      </div>

      <div className="max-h-[60vh] sm:max-h-[430px] overflow-y-auto">
        {visibleNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-3" />
            <h4 className="font-black text-gray-900">No notifications yet</h4>
            <p className="text-sm text-gray-500 mt-1">
              Admin announcements will appear here.
            </p>
          </div>
        ) : (
          <div>
            {visibleNotifications.slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => navigate("/dashboard/notifications")}
                className="w-full text-left px-4 sm:px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition flex gap-3 sm:gap-4 bg-blue-50/50"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 bg-blue-600 text-white">
                  <Bell size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-black text-sm text-gray-900 line-clamp-1">
                      {item.title}
                    </h4>

                    <span className="text-[9px] font-black bg-green-500 text-white rounded-full px-2 py-0.5 uppercase shrink-0">
                      New
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.message}
                  </p>

                  <div className="flex items-center justify-between gap-2 mt-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide truncate">
                      {item.type || "GENERAL"}
                    </span>

                    <span className="text-[10px] font-bold text-gray-400 shrink-0">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50">
        <button
          onClick={() => navigate("/dashboard/notifications")}
          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-extrabold hover:bg-blue-700 transition"
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
};

const ProfileDropdown = ({
  user,
  initials,
  goTo,
  handleLogout,
  markAllRead,
  close,
}) => {
  return (
    <div className="absolute right-0 mt-4 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          <ProfileAvatar user={user} initials={initials} size="lg" />

          <div className="min-w-0">
            <h4 className="font-black text-gray-900 truncate">
              {user.name || "User"}
            </h4>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="p-3">
        <DropdownButton
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
          onClick={() => {
            close();
            goTo("/dashboard");
          }}
        />

        <DropdownButton
          icon={<User size={18} />}
          label="My Profile"
          onClick={() => {
            close();
            goTo("/dashboard/profile");
          }}
        />

        <DropdownButton
          icon={<Settings size={18} />}
          label="Settings"
          onClick={() => {
            close();
            goTo("/dashboard/settings");
          }}
        />

        <DropdownButton
          icon={<CheckCheck size={18} />}
          label="Mark Notifications Read"
          onClick={() => {
            markAllRead();
            close();
          }}
        />
      </div>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 font-bold transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

const MobileMenu = ({
  navLinks,
  bookingPaths,
  location,
  user,
  initials,
  goTo,
  handleLogout,
}) => {
  return (
    <div className="absolute right-0 mt-3 w-[calc(100vw-24px)] max-w-sm bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
      {user ? (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <ProfileAvatar user={user} initials={initials} size="lg" />

            <div className="min-w-0">
              <h4 className="font-black text-gray-900 truncate">
                {user.name || "User"}
              </h4>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <p className="text-[10px] font-black text-blue-600 uppercase mt-1">
                {user.role || "USER"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-blue-50 border-b border-blue-100">
          <p className="font-black text-gray-900">Welcome to Ice Dome</p>
          <p className="text-sm text-gray-500 mt-1">
            Login to manage bookings and notifications.
          </p>
        </div>
      )}

      <div className="p-3">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active =
            location.pathname === link.path ||
            (link.name === "Book Tickets" &&
              bookingPaths.includes(location.pathname));

          return (
            <button
              key={link.name}
              onClick={() => goTo(link.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition ${active
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }`}
            >
              <Icon size={18} />
              {link.name}
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-gray-100">
        {user ? (
          <>
            <button
              onClick={() => goTo("/dashboard")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-bold transition"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>

            <button
              onClick={() => goTo("/dashboard/profile")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-bold transition"
            >
              <User size={18} />
              My Profile
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 font-bold transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => goTo("/login")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition"
          >
            <User size={18} />
            Login
          </button>
        )}
      </div>
    </div>
  );
};

const DropdownButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-bold transition"
  >
    {icon}
    {label}
  </button>
);

const ProfileAvatar = ({ user, initials, size = "sm" }) => {
  const [imageError, setImageError] = useState(false);

  const sizeClass =
    size === "lg"
      ? "w-12 h-12 rounded-2xl text-base"
      : "w-9 h-9 rounded-xl text-sm";

  useEffect(() => {
    setImageError(false);
  }, [user?.profileImage]);

  const getImageUrl = () => {
    if (!user?.profileImage) return null;

    let imageUrl = "";

    if (user.profileImage.startsWith("http")) {
      imageUrl = user.profileImage;
    } else if (user.profileImage.startsWith("/uploads")) {
      imageUrl = `${API_URL}${user.profileImage}`;
    } else {
      imageUrl = `${API_URL}/uploads/profile/${user.profileImage}`;
    }

    return `${imageUrl}?v=${Date.now()}`;
  };

  const imageUrl = getImageUrl();

  if (imageUrl && !imageError) {
    return (
      <img
        src={imageUrl}
        alt={user?.name || "Profile"}
        onError={() => setImageError(true)}
        className={`${sizeClass} object-cover border border-blue-100 bg-blue-100`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} bg-blue-600 text-white flex items-center justify-center font-black shrink-0`}
    >
      {initials}
    </div>
  );
};

export default Navbar;