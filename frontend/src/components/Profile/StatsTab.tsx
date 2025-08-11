import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";
import { Plane, Calendar, Wallet, MapPin, Clock } from "lucide-react";
import api from "@/api/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Trip {
  budget?: number;
  status?: "upcoming" | "ongoing" | "completed";
  country?: string;
  durationDays?: number;
}

const StatsTab: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/trips"); // Adjust endpoint to your backend
        setTrips(res.data || []);
      } catch (err) {
        console.error("Failed to fetch trips", err);
      }
    };
    fetchTrips();
  }, []);

  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const avgBudget = trips.length ? totalBudget / trips.length : 0;
  const upcomingCount = trips.filter(t => t.status === "upcoming" || t.status === "ongoing").length;
  const pastCount = trips.filter(t => t.status === "completed").length;
  const mostVisitedCountry =
    trips.length > 0
      ? Object.entries(
          trips.reduce((acc: Record<string, number>, trip) => {
            if (trip.country) acc[trip.country] = (acc[trip.country] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";
  const avgDuration =
    trips.length > 0
      ? trips.reduce((sum, t) => sum + (t.durationDays || 0), 0) / trips.length
      : 0;

  const data = {
    labels: ["Upcoming", "Past"],
    datasets: [
      {
        label: "Trips",
        data: [upcomingCount, pastCount],
        backgroundColor: [
          "rgba(75,85,99,0.8)", // gray-600
          "rgba(31,41,55,0.8)", // gray-800
        ],
        borderRadius: 8,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6b7280" } },
      y: { grid: { display: false }, ticks: { color: "#6b7280", stepSize: 1 } },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const stats = [
    { label: "Total Trips", value: trips.length, icon: Plane },
    { label: "Total Budget", value: `₹${totalBudget}`, icon: Wallet },
    { label: "Average Budget", value: `₹${avgBudget.toFixed(2)}`, icon: Wallet },
    { label: "Upcoming Trips", value: upcomingCount, icon: Calendar },
    { label: "Past Trips", value: pastCount, icon: Calendar },
    { label: "Most Visited", value: mostVisitedCountry, icon: MapPin },
    { label: "Avg Duration", value: `${avgDuration.toFixed(1)} days`, icon: Clock },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center">
        Trip Statistics
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="p-6 rounded-xl shadow-lg bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-800 flex items-center space-x-4 hover:shadow-2xl transition"
          >
            <stat.icon className="w-10 h-10 text-gray-700 dark:text-gray-300 opacity-80" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-xl h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default StatsTab;
