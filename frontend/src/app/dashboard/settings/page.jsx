"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
    Lock,
    Bell,
    LogOut,
    Trash2,
    ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState({
        booking: true,
        payment: true,
        promotion: false,
        shop: true,
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationLoading, setNotificationLoading] = useState(false);
    useEffect(() => {
        const fetchNotificationSettings = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    return;
                }

                const user = result.data.user;

                setNotifications({
                    booking: user.bookingNotifications,
                    payment: user.paymentNotifications,
                    promotion: user.promotionNotifications,
                    shop: user.shopNotifications,
                });

                localStorage.setItem("user", JSON.stringify(user));
            } catch (error) {
                console.log("Failed to load notification settings", error);
            }
        };

        fetchNotificationSettings();
    }, []);

    const handleSaveNotifications = async () => {
        setNotificationMessage("");

        try {
            setNotificationLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                setNotificationMessage("You are not logged in");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/auth/notification-settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    bookingNotifications: notifications.booking,
                    paymentNotifications: notifications.payment,
                    promotionNotifications: notifications.promotion,
                    shopNotifications: notifications.shop,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                setNotificationMessage(result.message || "Failed to save notifications");
                return;
            }

            localStorage.setItem("user", JSON.stringify(result.data.user));
            setNotificationMessage("Notification settings saved successfully");
        } catch (error) {
            setNotificationMessage("Cannot connect to backend server");
        } finally {
            setNotificationLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage("");

        try {
            setPasswordLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                setPasswordMessage("You are not logged in");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/auth/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                        confirmPassword,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                setPasswordMessage(result.message || "Failed to update password");
                return;
            }

            setPasswordMessage("Password updated successfully");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setPasswordMessage("Cannot connect to backend server");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const toggleNotification = (key) => {
        setNotifications((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <DashboardLayout
            title="Settings"
            subtitle="Manage your account security and notification preferences."
        >
            <div className="space-y-6">
                {/* Account Security */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center">
                            <ShieldCheck size={28} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900">
                                Account Security
                            </h2>
                            <p className="text-gray-500">
                                Update your password and keep your account safe.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleChangePassword}>
                        {passwordMessage && (
                            <div className="mb-5 rounded-2xl bg-blue-50 text-blue-700 px-4 py-3 text-sm font-semibold">
                                {passwordMessage}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input
                                type="password"
                                placeholder="Current password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-60"
                        >
                            <Lock size={18} />
                            {passwordLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </section>

                {/* Notifications */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center">
                            <Bell size={28} />
                        </div>

                        <div>
                            <h2 className="text-2xl font-extrabold text-gray-900">
                                Notifications
                            </h2>
                            <p className="text-gray-500">
                                Choose what updates you want to receive.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <SettingToggle
                            title="Booking Updates"
                            desc="Receive booking confirmation and schedule changes."
                            checked={notifications.booking}
                            onClick={() => toggleNotification("booking")}
                        />

                        <SettingToggle
                            title="Payment Updates"
                            desc="Receive payment success, failed payment, and refund updates."
                            checked={notifications.payment}
                            onClick={() => toggleNotification("payment")}
                        />

                        <SettingToggle
                            title="Promotions"
                            desc="Receive special offers and Ice Dome announcements."
                            checked={notifications.promotion}
                            onClick={() => toggleNotification("promotion")}
                        />

                        <SettingToggle
                            title="Shop Order Updates"
                            desc="Receive updates about equipment orders."
                            checked={notifications.shop}
                            onClick={() => toggleNotification("shop")}
                        />
                        {notificationMessage && (
                            <div className="mt-5 rounded-2xl bg-blue-50 text-blue-700 px-4 py-3 text-sm font-semibold">
                                {notificationMessage}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleSaveNotifications}
                            disabled={notificationLoading}
                            className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-800 transition disabled:opacity-60"
                        >
                            {notificationLoading ? "Saving..." : "Save Notification Settings"}
                        </button>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

const SettingToggle = ({ title, desc, checked, onClick }) => (
    <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
        <div>
            <p className="font-extrabold text-gray-900">{title}</p>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
        </div>

        <button
            type="button"
            onClick={onClick}
            className={`w-14 h-8 rounded-full p-1 transition ${checked ? "bg-blue-900" : "bg-gray-300"
                }`}
        >
            <span
                className={`block w-6 h-6 bg-white rounded-full transition ${checked ? "translate-x-6" : "translate-x-0"
                    }`}
            />
        </button>
    </div>
);