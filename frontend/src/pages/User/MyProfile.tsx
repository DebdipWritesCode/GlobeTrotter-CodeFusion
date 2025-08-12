import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  email: string;
  city?: string;
  country?: string;
  avatar?: string;
}

interface Trip {
  _id: string;
  title: string;
  coverPhoto?: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "completed";
  budget?: number;
}

// TripsTab Component
const TripsTab: React.FC<{ trips: Trip[] }> = ({ trips }) => {
  if (trips.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No trips found.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <motion.div
          key={trip._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 dark:bg-gray-900/60 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-xl p-4 hover:bg-white/20 dark:hover:bg-gray-900/80 transition-all"
        >
          {trip.coverPhoto && (
            <img
              src={trip.coverPhoto}
              alt={trip.title}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {trip.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </p>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            trip.status === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
            trip.status === 'ongoing' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
            'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300'
          }`}>
            {trip.status}
          </span>
          {trip.budget && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Budget: ₹{trip.budget}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// StatsTab Component
const StatsTab: React.FC<{ trips: Trip[] }> = ({ trips }) => {
  const totalTrips = trips.length;
  const completedTrips = trips.filter(t => t.status === 'completed').length;
  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.status === 'ongoing').length;
  const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);

  const stats = [
    { label: 'Total Trips', value: totalTrips },
    { label: 'Completed Trips', value: completedTrips },
    { label: 'Upcoming Trips', value: upcomingTrips },
    { label: 'Total Budget', value: `₹${totalBudget}` },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 dark:bg-gray-900/60 backdrop-blur-lg border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {stat.value}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

const MyProfile: React.FC = () => {
  type TabKey = "upcoming" | "past" | "stats";
  const [activeTab, setActiveTab] = useState<TabKey>("upcoming");
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    country: "",
  });

  const userId = useSelector((state: RootState) => state.auth.user_id);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!userId) return;

        const [userRes, tripsRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/trips/user`),
        ]);

        const fullName = userRes.data.name || "";
        const [first, ...rest] = fullName.split(" ");
        const last = rest.join(" ");

        setUser(userRes.data);
        setFormData({
          firstName: first || "",
          lastName: last || "",
          email: userRes.data.email || "",
          city: userRes.data.city || "",
          country: userRes.data.country || "",
        });
        setTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
      } catch (err) {
        console.error("Error fetching profile data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setUploadingAvatar(true);
    setAvatarError("");

    const formDataUpload = new FormData();
    formDataUpload.append("avatar", file);

    try {
      const res = await api.put(`/users/${userId}/avatar`, formDataUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prevUser) => (prevUser ? { ...prevUser, avatar: res.data.avatar } : res.data));
    } catch (err: unknown) {
      const msg =
        (typeof err === "object" && err && (err as { response?: { data?: { message?: string } } }).response?.data?.message) ||
        (typeof err === "object" && err && (err as { message?: string }).message) ||
        "Failed to upload avatar.";
      setAvatarError(msg);
    } finally {
      setUploadingAvatar(false);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    try {
      if (!userId || !token) return;

      const updatedData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        city: formData.city,
        country: formData.country,
      };

      const res = await api.put(`/users/${userId}`, updatedData);

      setUser(res.data);
      setEditOpen(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
      toast.error("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

  const upcomingTrips = trips.filter(
    (t) => t.status === "upcoming" || t.status === "ongoing"
  );
  const pastTrips = trips.filter((t) => t.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 dark:from-gray-950 dark:via-gray-900 dark:to-black flex flex-col items-center py-10 px-4 font-sans transition-colors">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl bg-white/10 dark:bg-gray-900/60 backdrop-blur-lg border border-gray-200 dark:border-gray-800 p-8 flex flex-col md:flex-row items-center md:items-start gap-8 mb-10"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-gray-300 to-gray-500 dark:from-gray-700 dark:to-gray-900 flex items-center justify-center text-4xl font-extrabold text-gray-700 dark:text-gray-200 select-none shadow overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              (formData.firstName?.[0] || "U") + (formData.lastName?.[0] || "")
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploadingAvatar}
          />
          {uploadingAvatar && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {formData.firstName} {formData.lastName}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">{formData.email}</p>
          {(formData.city || formData.country) && (
            <p className="mt-1 text-gray-400 dark:text-gray-400 text-sm">
              {formData.city ? formData.city + ", " : ""}
              {formData.country || ""}
            </p>
          )}
          {avatarError && (
            <p className="mt-2 text-red-500 text-sm">{avatarError}</p>
          )}
        </div>

        {/* Edit Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setEditOpen(true)}
          className="bg-gradient-to-r from-purple-500/80 to-purple-700/80 hover:from-purple-600 hover:to-purple-800 transition px-5 py-2 rounded-md font-semibold shadow text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Edit Profile
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <div className="w-full max-w-3xl mx-auto flex border-b border-gray-300 dark:border-gray-700 mb-8 text-lg bg-white/10 dark:bg-gray-900/40 backdrop-blur rounded-xl overflow-hidden">
    {(["upcoming", "past", "stats"] as TabKey[]).map((tab) => (
          <button
            key={tab}
      onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-3 font-medium capitalize transition-colors duration-300 ${
              activeTab === tab
                ? "border-b-4 border-purple-500 text-purple-500 bg-white/20 dark:bg-gray-900/60"
                : "text-gray-500 dark:text-gray-400 hover:text-purple-500"
            }`}
          >
            {tab === "upcoming"
              ? "Upcoming Trips"
              : tab === "past"
              ? "Past Trips"
              : "Stats"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="w-full max-w-3xl mx-auto">
        {activeTab === "upcoming" && <TripsTab trips={upcomingTrips} />}
        {activeTab === "past" && <TripsTab trips={pastTrips} />}
        {activeTab === "stats" && <StatsTab trips={trips} />}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setEditOpen(false);
              }
            }}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl w-full max-w-md p-8 relative text-gray-900 dark:text-gray-100"
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Edit Profile
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="firstName" className="block mb-1 font-medium">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1 font-medium">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block mb-1 font-medium">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block mb-1 font-medium">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 font-semibold text-white transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyProfile;