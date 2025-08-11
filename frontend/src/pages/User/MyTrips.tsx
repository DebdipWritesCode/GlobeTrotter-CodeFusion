import api from "@/api/axios";
import React, { useState, useEffect } from "react";

type Trip = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "past" | "completed" | "ongoing";
  coverPhoto?: string;
};
function getTripStatus(trip: Trip): Trip["status"] {
  const now = new Date();
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);

  if (now < start) return "upcoming";
  if (now > end) return "completed";
  return "ongoing";
}


const tabNames = ["upcoming", "ongoing", "completed"] as const;

const MyTrips: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<typeof tabNames[number]>("upcoming");
  const [sortKey, setSortKey] = useState<"date" | "name">("date");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
  const fetchTrips = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/trips/user");
      setTrips(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  fetchTrips();
}, []);

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


  const cardStyle: React.CSSProperties = {
    backgroundColor: "#1e1e1e",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "15px",
    display: "flex",
    gap: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
  };

  const imgStyle: React.CSSProperties = {
    width: "120px",
    height: "80px",
    borderRadius: "8px",
    objectFit: "cover",
  };

  const darkStyle: React.CSSProperties = {
    backgroundColor: "#121212",
    color: "#eee",
    minHeight: "100vh",
    padding: "20px 40px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const searchInputStyle: React.CSSProperties = {
    padding: "10px 14px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#2e2e2e",
    color: "#eee",
    flex: "1 1 300px",
    marginRight: "20px",
  };

  const tabsContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "15px",
    marginBottom: "0",
  };

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "10px 20px",
    cursor: "pointer",
    borderRadius: "8px",
    backgroundColor: isActive ? "#444" : "#2e2e2e",
    color: isActive ? "#fff" : "#aaa",
    fontWeight: isActive ? "600" : "400",
    userSelect: "none",
    whiteSpace: "nowrap",
  });

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    padding: "10px 20px",
    marginLeft: "10px",
    backgroundColor: active ? "#444" : "#2e2e2e",
    color: active ? "#fff" : "#aaa",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: active ? "600" : "400",
    whiteSpace: "nowrap",
  });

  const controlsRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px",
  };

  return (
    <div style={darkStyle}>
      <h1 style={{ marginBottom: "15px", fontWeight: "bold" }}>My Trips</h1>

      <div style={controlsRowStyle}>
        <input
          type="text"
          placeholder="Search trips by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInputStyle}
        />

        <div style={tabsContainerStyle}>
          {tabNames.map((tab) => (
            <div
              key={tab}
              style={tabStyle(tab === activeTab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>

        <button
          style={buttonStyle(sortKey === "date")}
          onClick={() => setSortKey("date")}
          title="Sort by Date"
        >
          Sort Date
        </button>
        <button
          style={buttonStyle(sortKey === "name")}
          onClick={() => setSortKey("name")}
          title="Sort by Name"
        >
          Sort Name
        </button>
      </div>

      {loading && <p>Loading trips...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && filteredTrips.length === 0 && <p>No {activeTab} trips found.</p>}

      {filteredTrips.map((trip) => (
        <div key={trip._id} style={cardStyle}>
          <img
            src={trip.coverPhoto || "https://via.placeholder.com/120x80.png?text=No+Image"}
            alt={trip.title}
            style={imgStyle}
          />
          <div>
            <h3>{trip.title}</h3>
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(trip.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </p>
            <p>{trip.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTrips;
