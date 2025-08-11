import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import TripsTab from "@/components/Profile/TripsTab";
import StatsTab from "@/components/Profile/StatsTab";

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

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tripsRes] = await Promise.all([
          axios.get(`/api/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`/api/users/${userId}/trips`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setUser(userRes.data);
        setTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
      } catch (err) {
        console.error("Error fetching profile data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, token]);

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  const upcomingTrips = trips.filter(t => t.status === "upcoming");
  const pastTrips = trips.filter(t => t.status === "completed");

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ProfileHeader user={user} />

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {["upcoming", "past", "stats"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-medium capitalize ${
              activeTab === tab ? "border-b-4 border-indigo-500 text-indigo-600" : "text-gray-500"
            }`}
          >
            {tab === "upcoming" ? "Upcoming Trips" : tab === "past" ? "Past Trips" : "Stats"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "upcoming" && <TripsTab trips={upcomingTrips} />}
      {activeTab === "past" && <TripsTab trips={pastTrips} />}
      {activeTab === "stats" && <StatsTab trips={trips} />}
    </div>
  );
};

export default MyProfile;
