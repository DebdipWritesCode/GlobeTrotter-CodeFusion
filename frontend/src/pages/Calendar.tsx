import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "@/api/axios";

const localizer = momentLocalizer(moment);

type TripEvent = {
  title: string;
  start: Date;
  end: Date;
  budget: string;
  duration: string;
  image: string;
  type: "upcoming" | "ongoing" | "past" | string;
  allDay: boolean;
  badge?: string | number;
};
type TripAPI = {
  title?: string;
  startDate: string;
  endDate: string;
  budget?: string;
  duration?: string;
  coverPhoto?: string;
  status?: "upcoming" | "ongoing" | "past" | string;
};

const Calendar = () => {
  const [trips, setTrips] = useState<TripEvent[]>([]);
  const [hoveredEvent, setHoveredEvent] = useState<TripEvent | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get("/trips/user");
        const data = res.data;
  const events: TripEvent[] = data.map((trip: TripAPI) => ({
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

  const eventStyleGetter = (event: TripEvent) => {
    let backgroundColor = "var(--primary)";
    let color = "var(--primary-foreground)";
    if (event.type === "past") {
      backgroundColor = "var(--ring)";
      color = "var(--foreground)";
    } else if (event.type === "ongoing") {
      backgroundColor = "var(--accent)";
      color = "var(--accent-foreground)";
    } else if (event.type === "upcoming") {
      backgroundColor = "var(--primary)";
      color = "var(--primary-foreground)";
    }
    return {
      style: {
        backgroundColor,
        borderRadius: "8px 8px 0 0",
        color,
        border: "none",
        padding: "3px 6px",
        fontSize: "0.9rem",
        cursor: "pointer",
        marginTop: "2px",
      },
    };
  };

  const handleMouseEnter = (event: TripEvent, e: React.MouseEvent<HTMLDivElement>) => {
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
      className="min-h-screen flex flex-col items-center justify-start bg-background text-foreground py-8 px-2"
      style={{ width: "100%" }}
    >
      {/* Heading and description */}
      <div className="max-w-2xl w-full mx-auto mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-tight drop-shadow">
           My Travel Calendar
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          All your trips, at a glance. Plan, track, and relive your journeys
          with this interactive calendar. Hover over events for details, or tap
          on mobile for a compact view.
        </p>
      </div>

      <style>{`
        .rbc-toolbar button {
          color: var(--foreground) !important;
          background: transparent !important;
          border: 1px solid var(--primary) !important;
          border-radius: 6px;
          padding: 5px 10px;
        }
        .rbc-toolbar button:hover {
          background: var(--primary) !important;
          color: var(--primary-foreground) !important;
        }
        .rbc-off-range-bg {
          background: color-mix(in oklab, var(--muted) 85%, transparent) !important;
        }
        .rbc-today {
          background: linear-gradient(135deg, color-mix(in oklab, var(--muted) 80%, transparent), color-mix(in oklab, var(--muted) 60%, transparent)) !important;
          border: 2px solid var(--primary) !important;
        }
        .rbc-month-view, .rbc-time-view {
          background: var(--card);
          border-color: var(--border);
        }
        .rbc-header {
          background: var(--card);
          color: var(--foreground);
          border: none;
        }
        .rbc-event {
          border-radius: 8px 8px 0 0 !important;
          margin: 2px 0 0 0 !important;
        }
        .rbc-time-content, .rbc-day-bg, .rbc-month-row, .rbc-date-cell, .rbc-time-slot, .rbc-timeslot-group {
          border-color: var(--border) !important;
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
            color: "var(--foreground)",
            fontSize: isMobile ? "0.95rem" : "1.08rem",
            borderRadius: 18,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            background: "var(--card)",
          }}
          eventPropGetter={eventStyleGetter}
          views={["month"]}
          components={{
            event: ({ event }: { event: TripEvent }) => (
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
                      background: "var(--muted)",
                      color: "var(--foreground)",
                      borderRadius: "50%",
                      width: "22px",
                      height: "22px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      marginLeft: "2px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                      border: "2px solid var(--primary)",
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
            backgroundColor: "var(--card)",
            padding: 12,
            borderRadius: 12,
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            width: 250,
            zIndex: 1000,
            color: "var(--foreground)",
            border: "1px solid var(--border)",
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
                  ? "var(--ring)"
                  : hoveredEvent.type === "ongoing"
                  ? "var(--accent)"
                  : "var(--primary)",
              color:
                hoveredEvent.type === "ongoing"
                  ? "var(--accent-foreground)"
                  : "var(--primary-foreground)",
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
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
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
