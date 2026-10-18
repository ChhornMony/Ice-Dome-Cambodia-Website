"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Camera, Mail, Phone, User, Save } from "lucide-react";

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const API_URL = RAW_API_URL.replace(/\/+$/, "").replace(/\/api$/, "");

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  const getImageUrl = (profileImage) => {
    if (!profileImage) return "";

    if (profileImage.startsWith("http")) {
      return profileImage;
    }

    if (profileImage.startsWith("/uploads")) {
      return `${API_URL}${profileImage}`;
    }

    return `${API_URL}/uploads/profile/${profileImage}`;
  };

  const syncUserToNavbar = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    window.dispatchEvent(new Event("userUpdated"));
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        return;
      }

      const response = await fetch(`${API_URL}/api/profile/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Cannot load profile.");
        return;
      }

      const currentUser = result.data.user;

      setUser(currentUser);
      setName(currentUser.name || "");
      setPhone(currentUser.phone || "");

      if (currentUser.profileImage) {
        setPreview(getImageUrl(currentUser.profileImage));
      } else {
        setPreview("");
      }

      syncUserToNavbar(currentUser);
    } catch (error) {
      setMessage("Cannot load profile.");
    }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setMessage("");

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        return;
      }

      const response = await fetch(`${API_URL}/api/profile/me/photo`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Failed to upload photo.");
        return;
      }

      const updatedUser = result.data.user;

      setUser(updatedUser);

      if (updatedUser.profileImage) {
        setPreview(getImageUrl(updatedUser.profileImage));
      }

      syncUserToNavbar(updatedUser);

      setMessage("Profile photo updated successfully.");
    } catch (error) {
      setMessage("Cannot upload photo.");
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("You are not logged in.");
        return;
      }

      const response = await fetch(`${API_URL}/api/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(result.message || "Failed to update profile.");
        return;
      }

      const updatedUser = result.data.user;

      setUser(updatedUser);

      if (updatedUser.profileImage) {
        setPreview(getImageUrl(updatedUser.profileImage));
      }

      syncUserToNavbar(updatedUser);

      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage("Cannot update profile.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <DashboardLayout
      title="Profile"
      subtitle="Manage your personal information and profile photo."
    >
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        {message && (
          <div className="mb-6 rounded-2xl bg-blue-50 text-blue-700 px-4 py-3 text-sm font-semibold">
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-10">
          {/* Profile Photo */}
          <div className="md:w-72">
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 text-center">
              <div className="relative w-36 h-36 mx-auto mb-5">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    onError={() => setPreview("")}
                    className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-4xl font-black border-4 border-white shadow-md">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}

                <label className="absolute bottom-2 right-2 w-11 h-11 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-blue-700 transition">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleUploadPhoto}
                    className="hidden"
                  />
                </label>
              </div>

              <h3 className="text-xl font-extrabold text-gray-900">
                {user?.name || "User"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>

              <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-4">
                {user?.role || "USER"}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="flex-1">
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-bold text-gray-400 mb-2">
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-bold text-gray-400 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    value={user?.email || ""}
                    disabled
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-100 rounded-2xl text-gray-400 cursor-not-allowed"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-2">
                  Email cannot be changed here.
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-[0.15em] font-bold text-gray-400 mb-2">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="+855 12 345 678"
                  />
                </div>
              </div>

              <button className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-extrabold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                <Save size={18} />
                Save Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}