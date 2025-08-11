import React, { useState, useEffect } from "react";
import api from "@/api/axios";

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

const MyTrips: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<typeof tabNames[number]>("upcoming");
  const [sortKey, setSortKey] = useState<"date" | "name">("date");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // For update modal
  const [updateTrip, setUpdateTrip] = useState<Trip | null>(null);
  const [updateFile, setUpdateFile] = useState<File | null>(null);

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
      const response = await api.put(`/trips/${updateTrip._id}`, formData, {
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

  // Styles
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

  const buttonStyle = (color: string): React.CSSProperties => ({
    padding: "8px 14px",
    marginRight: "10px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: color,
  });

  const controlsRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "30px",
  };

  // Custom file input styles
  const fileInputLabelStyle: React.CSSProperties = {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "10px",
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
          style={{
            ...buttonStyle("#444"),
            backgroundColor: sortKey === "date" ? "#444" : "#2e2e2e",
            color: sortKey === "date" ? "#fff" : "#aaa",
            marginLeft: 0,
          }}
          onClick={() => setSortKey("date")}
          title="Sort by Date"
        >
          Sort Date
        </button>
        <button
          style={{
            ...buttonStyle("#444"),
            backgroundColor: sortKey === "name" ? "#444" : "#2e2e2e",
            color: sortKey === "name" ? "#fff" : "#aaa",
          }}
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
          <div style={{ flex: 1 }}>
            <h3>{trip.title}</h3>
            <p>
              <strong>Start Date:</strong> {new Date(trip.startDate).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong> {new Date(trip.endDate).toLocaleDateString()}
            </p>
            <p>{trip.description}</p>

            {/* Show buttons only on upcoming trips */}
            {getTripStatus(trip) === "upcoming" && (
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => handleDelete(trip._id)}
                  style={buttonStyle("red")}
                >
                  Delete
                </button>
                <button
                  onClick={() => setUpdateTrip(trip)}
                  style={buttonStyle("green")}
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Update Modal */}
      {updateTrip && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setUpdateTrip(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#222",
              padding: 20,
              borderRadius: 10,
              width: "400px",
              maxHeight: "90vh",
              overflowY: "auto",
              color: "#eee",
            }}
          >
            <h2 style={{ marginBottom: 20 }}>Update Trip</h2>

            <label>
              Title
              <input
                type="text"
                value={updateTrip.title}
                onChange={(e) =>
                  setUpdateTrip({ ...updateTrip, title: e.target.value })
                }
                style={{
                  width: "100%",
                  marginBottom: 15,
                  borderRadius: 6,
                  padding: 8,
                  border: "none",
                }}
              />
            </label>

            <label>
              Description
              <textarea
                value={updateTrip.description}
                onChange={(e) =>
                  setUpdateTrip({ ...updateTrip, description: e.target.value })
                }
                style={{
                  width: "100%",
                  marginBottom: 15,
                  borderRadius: 6,
                  padding: 8,
                  border: "none",
                  resize: "vertical",
                }}
              />
            </label>

            <label>
              Start Date
              <input
                type="date"
                value={updateTrip.startDate.slice(0, 10)}
                onChange={(e) =>
                  setUpdateTrip({ ...updateTrip, startDate: e.target.value })
                }
                style={{
                  width: "100%",
                  marginBottom: 15,
                  borderRadius: 6,
                  padding: 8,
                  border: "none",
                }}
              />
            </label>

            <label>
              End Date
              <input
                type="date"
                value={updateTrip.endDate.slice(0, 10)}
                onChange={(e) =>
                  setUpdateTrip({ ...updateTrip, endDate: e.target.value })
                }
                style={{
                  width: "100%",
                  marginBottom: 15,
                  borderRadius: 6,
                  padding: 8,
                  border: "none",
                }}
              />
            </label>

            <label
              htmlFor="coverPhotoUpload"
              style={fileInputLabelStyle}
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
              style={{ display: "none" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 15,
              }}
            >
              <button
                onClick={() => setUpdateTrip(null)}
                style={{
                  ...buttonStyle("#555"),
                  backgroundColor: "#555",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                style={{
                  ...buttonStyle("green"),
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTrips;
