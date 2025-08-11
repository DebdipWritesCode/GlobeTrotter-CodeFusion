import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "@/api/axios";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [trips, setTrips] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/trips/user");
        const data = res.data;
        const events = data.map((trip) => ({
          title: trip.title || "Trip",
          start: new Date(trip.startDate),
          end: new Date(trip.endDate),
          budget: trip.budget || "N/A",
          duration:
            trip.duration ||
            `${
              Math.ceil(
                (new Date(trip.endDate).getTime() -
                  new Date(trip.startDate).getTime()) /
                  (1000 * 3600 * 24)
              ) + 1
            } days`,
          image:
            trip.coverPhoto ||
            "https://images.unsplash.com/photo-1677820915366-27d887c9b872?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG1hbmFsaXxlbnwwfDB8MHx8fDA%3D",
          type: trip.status || "upcoming",
          allDay: true,
        }));
        setTrips(events);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();

    // Responsive handler
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const eventStyleGetter = (event) => {
    let backgroundColor = "";
    if (event.type === "past") backgroundColor = "#555";
    else if (event.type === "ongoing") backgroundColor = "#8e6dc4";
    else if (event.type === "upcoming") backgroundColor = "#6c5ce7";
    return {
      style: {
        backgroundColor,
        borderRadius: "8px 8px 0 0",
        color: "#fff",
        border: "none",
        padding: "3px 6px",
        fontSize: "0.9rem",
        cursor: "pointer",
        marginTop: "2px",
      },
    };
  };

  const handleMouseEnter = (event, e) => {
    if (!isMobile) {
      setHoveredEvent(event);
      setMousePos({ x: e.clientX + 10, y: e.clientY + 10 });
    }
  };

  const handleMouseLeave = () => {
    setHoveredEvent(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start bg-[#1e1e1e] py-8 px-2"
      style={{ width: "100%" }}
    >
      {/* Heading and description */}
      <div className="max-w-2xl w-full mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow">
           My Travel Calendar
        </h1>
        <p className="text-gray-300 text-base md:text-lg">
          All your trips, at a glance. Plan, track, and relive your journeys
          with this interactive calendar. Hover over events for details, or tap
          on mobile for a compact view.
        </p>
      </div>

      <style>{`
        .rbc-toolbar button {
          color: white !important;
          background: transparent !important;
          border: 1px solid #6c5ce7 !important;
          border-radius: 6px;
          padding: 5px 10px;
        }
        .rbc-toolbar button:hover {
          background: #6c5ce7 !important;
        }
        .rbc-off-range-bg {
          background: #3a3a4d !important;
        }
        .rbc-today {
          background: linear-gradient(135deg, #2d2d44, #3a3a5a) !important;
          border: 2px solid #6c5ce7 !important;
        }
        .rbc-month-view, .rbc-time-view {
          background: #1e1e2f;
          border-color: #444;
        }
        .rbc-header {
          background: #2c2c3e;
          color: white;
          border: none;
        }
        .rbc-event {
          border-radius: 8px 8px 0 0 !important;
          margin: 2px 0 0 0 !important;
        }
      `}</style>

      <div
        className="w-full"
        style={{
          maxWidth: isMobile ? 420 : 1050,
          minHeight: isMobile ? 440 : 700, 
          margin: "0 auto",
        }}
      >
        <BigCalendar
          localizer={localizer}
          events={trips}
          startAccessor="start"
          endAccessor="end"
          style={{
            height: isMobile ? 440 : "80vh", // Increased height
            color: "#fff",
            fontSize: isMobile ? "0.95rem" : "1.08rem",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            background: "#1e1e2f",
          }}
          eventPropGetter={eventStyleGetter}
          views={["month"]}
          components={{
            event: ({ event }) => (
              <div
                onMouseEnter={(e) => handleMouseEnter(event, e)}
                onMouseLeave={handleMouseLeave}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  fontWeight: 500,
                  fontSize: isMobile ? "0.95rem" : "1.08rem",
                }}
              >
                <span>{event.title}</span>
                {event.badge && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#23234a",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      marginLeft: "2px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                      border: "2px solid #6c5ce7",
                    }}
                  >
                    {event.badge}
                  </span>
                )}
              </div>
            ),
          }}
        />
      </div>

      {/* Popup only on desktop/tablet */}
      {!isMobile && hoveredEvent && (
        <div
          style={{
            position: "fixed",
            top: mousePos.y,
            left: mousePos.x,
            backgroundColor: "#2c2c2c",
            padding: 12,
            borderRadius: 12,
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            width: 250,
            zIndex: 1000,
            color: "#fff",
          }}
        >
          <img
            src={hoveredEvent.image}
            alt={hoveredEvent.title}
            style={{
              width: "100%",
              height: 150,
              borderRadius: 8,
              objectFit: "cover",
              marginBottom: 8,
            }}
          />
          <h4 style={{ margin: "0 0 8px", fontWeight: "bold", fontSize: 16 }}>
            {hoveredEvent.title}
          </h4>
          <div
            style={{
              display: "inline-block",
              backgroundColor:
                hoveredEvent.type === "past"
                  ? "#555"
                  : hoveredEvent.type === "ongoing"
                  ? "#8e6dc4"
                  : "#6c5ce7",
              color: "white",
              borderRadius: 12,
              padding: "2px 10px",
              fontWeight: "600",
              fontSize: 12,
              marginBottom: 8,
              userSelect: "none",
            }}
          >
            {hoveredEvent.type.toUpperCase()}
          </div>
          <p style={{ margin: 0, fontSize: 14 }}>💰 {hoveredEvent.budget}</p>
          <p style={{ margin: "0 0 8px", fontSize: 14 }}>
            ⏳ {hoveredEvent.duration}
          </p>
          <button
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#6c5ce7",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={() => alert(`Showing trip: ${hoveredEvent.title}`)}
          >
            Show Trip
          </button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
