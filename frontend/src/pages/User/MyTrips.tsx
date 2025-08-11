import React, { useState, useEffect } from "react";
import api from "@/api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, CalendarDays } from "lucide-react";

type Trip = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "past" | "completed" | "ongoing";
  coverPhoto?: string;
};

const tabNames = ["upcoming", "ongoing", "completed"] as const;

function getTripStatus(trip: Trip): Trip["status"] {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "ongoing";
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516406742981-2b7d67ec4ae8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWFuYWxpfGVufDB8MHwwfHx8MA%3D%3D";

const MyTrips: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<(typeof tabNames)[number]>("upcoming");
  const [sortKey, setSortKey] = useState<"date" | "name">("date");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const user_id = useSelector((state: RootState) => state.auth.user_id);
  const loading_auth = useSelector((state: RootState) => state.auth.loading);

  // For update modal
  const [updateTrip, setUpdateTrip] = useState<Trip | null>(null);
  const [updateFile, setUpdateFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/trips/user?userId=${user_id}`);
        setTrips(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [loading_auth, user_id]);

  const filteredTrips = trips
    .filter(
      (trip) =>
        getTripStatus(trip) === activeTab &&
        trip.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "date") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      } else {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      }
    });

  // Delete trip handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert("Failed to delete trip");
    }
  };

  // Update modal submit handler
  const handleUpdateSubmit = async () => {
    if (!updateTrip) return;

    const formData = new FormData();
    formData.append("title", updateTrip.title);
    formData.append("description", updateTrip.description);
    formData.append("startDate", updateTrip.startDate);
    formData.append("endDate", updateTrip.endDate);
    if (updateFile) {
      formData.append("coverPhoto", updateFile);
    }

    try {
      const response = await api.put(`/trips/edit/${updateTrip._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTrips((prev) =>
        prev.map((t) => (t._id === updateTrip._id ? response.data : t))
      );
      setUpdateTrip(null);
      setUpdateFile(null);
    } catch {
      alert("Failed to update trip");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-800 py-8 px-2 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">My Trips</h1>

        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 sticky top-0 z-10 bg-transparent">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              placeholder="Search trips by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white/10 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1"
            />
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition
                  ${sortKey === "date"
                    ? "bg-white/20 text-indigo-400 shadow"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                `}
                onClick={() => setSortKey("date")}
                title="Sort by Date"
              >
                Sort Date
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition
                  ${sortKey === "name"
                    ? "bg-white/20 text-indigo-400 shadow"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                `}
                onClick={() => setSortKey("name")}
                title="Sort by Name"
              >
                Sort Name
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {tabNames.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-lg font-semibold transition
                  ${activeTab === tab
                    ? "bg-white/20 text-indigo-400 shadow"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"}
                `}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <span className="text-gray-400 text-lg">Loading trips...</span>
          </div>
        )}
        {error && (
          <div className="text-red-400 font-semibold mb-4">{error}</div>
        )}

        {!loading && filteredTrips.length === 0 && (
          <p className="text-gray-400 text-center py-10">
            No {activeTab} trips found.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <motion.div
              key={trip._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
              className="relative bg-white/10 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col"
            >
              <div className="relative h-40 w-full">
                <img
                  src={trip.coverPhoto || DEFAULT_IMAGE}
                  alt={trip.title}
                  className="h-40 w-full object-cover rounded-t-xl transition-all duration-300"
                />
                <div className="absolute top-2 left-2 bg-gray-900/70 text-gray-100 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {getTripStatus(trip).toUpperCase()}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-100 mb-1">{trip.title}</h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">{trip.description}</p>
                <div className="text-xs text-gray-400 mb-2">
                  <span>
                    <strong>Start:</strong>{" "}
                    {new Date(trip.startDate).toLocaleDateString()}
                  </span>
                  <span className="ml-4">
                    <strong>End:</strong>{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
                {/* Buttons */}
                {getTripStatus(trip) === "upcoming" && (
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleDelete(trip._id)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button
                      onClick={() => setUpdateTrip(trip)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition"
                    >
                      <Pencil className="w-4 h-4" /> Update
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Update Modal */}
        <AnimatePresence>
          {updateTrip && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
              onClick={() => setUpdateTrip(null)}
            >
              <motion.div
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 40 }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-8 relative text-gray-900 dark:text-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-4">Update Trip</h2>
                <label className="block mb-2 font-medium">Title</label>
                <input
                  type="text"
                  value={updateTrip.title}
                  onChange={(e) =>
                    setUpdateTrip({ ...updateTrip, title: e.target.value })
                  }
                  className="w-full mb-4 px-3 py-2 rounded bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  value={updateTrip.description}
                  onChange={(e) =>
                    setUpdateTrip({ ...updateTrip, description: e.target.value })
                  }
                  className="w-full mb-4 px-3 py-2 rounded bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-vertical"
                />
                <label className="block mb-2 font-medium">Start Date</label>
                <input
                  type="date"
                  value={updateTrip.startDate.slice(0, 10)}
                  onChange={(e) =>
                    setUpdateTrip({ ...updateTrip, startDate: e.target.value })
                  }
                  className="w-full mb-4 px-3 py-2 rounded bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label className="block mb-2 font-medium">End Date</label>
                <input
                  type="date"
                  value={updateTrip.endDate.slice(0, 10)}
                  onChange={(e) =>
                    setUpdateTrip({ ...updateTrip, endDate: e.target.value })
                  }
                  className="w-full mb-4 px-3 py-2 rounded bg-white/60 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <label
                  htmlFor="coverPhotoUpload"
                  className="block mb-2 font-medium cursor-pointer"
                >
                  {updateFile ? updateFile.name : "Choose Cover Photo"}
                </label>
                <input
                  id="coverPhotoUpload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.length) setUpdateFile(e.target.files[0]);
                  }}
                  className="mb-4"
                />
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setUpdateTrip(null)}
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateSubmit}
                    className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white"
                  >
                    Save
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MyTrips;
