import React, { useEffect, useState } from "react";
import axios from "axios";

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
}

const MyProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "stats">("upcoming");
  const [user, setUser] = useState<User | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // Assuming auth token stored here
  const userId = localStorage.getItem("userId"); // Assuming userId stored here

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, tripsRes] = await Promise.all([
          axios.get(`/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/users/${userId}/trips`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUser(userRes.data);
        setTrips(tripsRes.data);
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

  const upcomingTrips = trips.filter((t) => t.status === "upcoming");
  const pastTrips = trips.filter((t) => t.status === "completed");

  const totalBudget = 12000; // Replace with API budget sum later
  const avgBudget = totalBudget / trips.length || 0;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-white rounded-xl shadow-lg">
        <img
          src="https://via.placeholder.com/120"
          alt="User Avatar"
          className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-gray-500">{user?.email}</p>
          <p className="text-gray-500">{user?.city}, {user?.country}</p>
          <button className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-6 py-3 font-medium ${
            activeTab === "upcoming" ? "border-b-4 border-indigo-500 text-indigo-600" : "text-gray-500"
          }`}
        >
          Upcoming Trips
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-6 py-3 font-medium ${
            activeTab === "past" ? "border-b-4 border-indigo-500 text-indigo-600" : "text-gray-500"
          }`}
        >
          Past Trips
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-6 py-3 font-medium ${
            activeTab === "stats" ? "border-b-4 border-indigo-500 text-indigo-600" : "text-gray-500"
          }`}
        >
          Stats
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "upcoming" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {upcomingTrips.map((trip) => (
            <div key={trip._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={trip.coverPhoto || "https://via.placeholder.com/300"}
                alt={trip.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{trip.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </p>
                <button className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "past" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {pastTrips.map((trip) => (
            <div key={trip._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                src={trip.coverPhoto || "https://via.placeholder.com/300"}
                alt={trip.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{trip.title}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </p>
                <button className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "stats" && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Trip Statistics</h2>
          <p>Total Trips: {trips.length}</p>
          <p>Total Budget: ₹{totalBudget}</p>
          <p>Average Budget per Trip: ₹{avgBudget.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
