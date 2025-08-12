import React, { useEffect, useState } from "react";
import axios from "axios";
import TripsTab from "@/components/Profile/TripsTab";
import StatsTab from "@/components/Profile/StatsTab";
import api from "@/api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  city?: string;
  country?: string;
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

const MyProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "stats">("upcoming");
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    country: "",
  });

  const userId = useSelector((state: RootState) => state.auth.user_id);
  console.log("User ID from Redux:", userId);
  const token = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tripsRes] = await Promise.all([
          api.get(`/users/${userId}`),
          api.get(`/trips/user`),
        ]);
        console.log("User data:", userRes.data);
        console.log("Trips data:", tripsRes.data);
        setUser(userRes.data);
        setFormData({
          firstName: userRes.data.firstName || "",
          lastName: userRes.data.lastName || "",
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
  }, [userId, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      if (!userId || !token) return;
      await axios.put(
        `/api/users/${userId}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          city: formData.city,
          country: formData.country,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => (prev ? { ...prev, ...formData } : prev));
      setEditOpen(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
  }

  const upcomingTrips = trips.filter((t) => t.status === "upcoming" || t.status === "ongoing");
  const pastTrips = trips.filter((t) => t.status === "completed");

  return (
    <div className="max-w-5xl mx-auto p-6 text-white font-sans min-h-screen bg-[#1e1e2f]">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-10">
        {/* Avatar circle with initials */}
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-700 flex items-center justify-center text-4xl font-extrabold text-white select-none shadow-lg">
          {(user?.firstName?.[0] || "U") + (user?.lastName?.[0] || "")}
        </div>

        {/* User info */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-300 mt-1">{user?.email}</p>
          {(user?.city || user?.country) && (
            <p className="mt-1 text-gray-400 text-sm">
              {user?.city ? user.city + ", " : ""}
              {user?.country || ""}
            </p>
          )}
        </div>

        {/* Edit Profile Button */}
        <button
          onClick={() => setEditOpen(true)}
          className="bg-[#6c5ce7] hover:bg-indigo-700 transition px-5 py-2 rounded-md font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-indigo-600 mb-8 text-lg">
        {["upcoming", "past", "stats"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-medium capitalize transition-colors duration-300 ${
              activeTab === tab
                ? "border-b-4 border-indigo-500 text-indigo-400"
                : "text-gray-400 hover:text-indigo-500"
            }`}
          >
            {tab === "upcoming" ? "Upcoming Trips" : tab === "past" ? "Past Trips" : "Stats"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "upcoming" && <TripsTab trips={upcomingTrips} />}
      {activeTab === "past" && <TripsTab trips={pastTrips} />}
      {activeTab === "stats" && <StatsTab trips={trips} />}

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-[#2c2c3e] rounded-lg shadow-lg w-full max-w-md p-6 relative text-white">
            <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="firstName" className="block text-gray-300 mb-1 font-medium">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded bg-[#1e1e2f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-gray-300 mb-1 font-medium">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded bg-[#1e1e2f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 mb-1 font-medium">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded bg-[#1e1e2f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-gray-300 mb-1 font-medium">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded bg-[#1e1e2f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-gray-300 mb-1 font-medium">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded bg-[#1e1e2f] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
