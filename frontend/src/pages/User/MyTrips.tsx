import React, { useState } from "react";

type Trip = {
  id: number;
  name: string;
  destination: string;
  date: string;
  status: "upcoming" | "past" | "completed";
  description: string;
  imageUrl: string;
};

const tripsData: Trip[] = [
  {
    id: 1,
    name: "Beach Vacation",
    destination: "Maldives",
    date: "2025-09-10",
    status: "upcoming",
    description: "Relax at the sunny beaches with crystal clear water.",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 2,
    name: "Mountain Trek",
    destination: "Himalayas",
    date: "2025-05-20",
    status: "completed",
    description: "Adventure trekking through the beautiful mountains.",
    imageUrl:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 3,
    name: "City Tour",
    destination: "Paris",
    date: "2025-06-15",
    status: "past",
    description: "Explore the romantic city of lights and its history.",
    imageUrl:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 4,
    name: "Desert Safari",
    destination: "Dubai",
    date: "2025-11-01",
    status: "upcoming",
    description: "Experience thrilling desert adventures and dunes.",
    imageUrl:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=60",
  },
  {
    id: 5,
    name: "Cruise Trip",
    destination: "Caribbean",
    date: "2025-04-01",
    status: "completed",
    description: "Luxury cruise around the beautiful islands.",
    imageUrl:
      "https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=600&q=60",
  },
];

const tabNames = ["upcoming", "past", "completed"] as const;

const MyTrips: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<typeof tabNames[number]>("upcoming");
  const [sortKey, setSortKey] = useState<"date" | "name">("date");

  const filteredTrips = tripsData
    .filter(
      (trip) =>
        trip.status === activeTab &&
        trip.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortKey === "date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        return a.name.localeCompare(b.name);
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

      {filteredTrips.length === 0 && <p>No {activeTab} trips found.</p>}

      {filteredTrips.map((trip) => (
        <div key={trip.id} style={cardStyle}>
          <img src={trip.imageUrl} alt={trip.name} style={imgStyle} />
          <div>
            <h3>{trip.name}</h3>
            <p>
              <strong>Destination:</strong> {trip.destination}
            </p>
            <p>
              <strong>Date:</strong> {trip.date}
            </p>
            <p>{trip.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyTrips;
