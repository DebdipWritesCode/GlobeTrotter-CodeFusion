import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronRight, ChevronLeft, ArrowDown, ChevronDown, X, Hotel, Train, AlertTriangle, MapPin, Star } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup as LeafletPopup } from "react-leaflet";
import L from "leaflet";

// Dummy geo data for Paris
const tripLocation = { lat: 48.8566, lng: 2.3522 };
const dayPins = [
  { lat: 48.8867, lng: 2.3431, label: "Montmartre" },
  { lat: 48.8584, lng: 2.2945, label: "Eiffel Tower" },
  { lat: 48.8049, lng: 2.1204, label: "Versailles" },
  { lat: 48.8625, lng: 2.2875, label: "Local Market" }
];

// Notification icons
const popupIcons = {
  hotel: <Hotel className="w-6 h-6 text-purple-200" />,
  ticket: <Train className="w-6 h-6 text-purple-300" />,
  alert: <AlertTriangle className="w-6 h-6 text-purple-400" />
};

// Day badges logic
const badgeTypes = [
  { key: "adventure", label: "Adventure", color: "bg-purple-700", icon: <Star className="w-4 h-4" /> },
  { key: "culture", label: "Culture", color: "bg-purple-600", icon: <MapPin className="w-4 h-4" /> },
  { key: "foodie", label: "Foodie", color: "bg-purple-400 text-gray-900", icon: <Star className="w-4 h-4" /> }
];
function getDayBadge(day: any) {
  const acts = day.activities.map((a: any) => a.type);
  if (acts.includes("activity")) return badgeTypes[0];
  if (acts.includes("food")) return badgeTypes[2];
  return badgeTypes[1];
}

type Activity = {
  id: string;
  title: string;
  time?: string;
  description?: string;
  cost?: number;
  image?: string;
  type?: "activity" | "stay" | "food" | "other";
};

type Day = {
  day: number;
  date?: string;
  title?: string;
  activities: Activity[];
};

type Itinerary = {
  title?: string;
  location?: string;
  days: Day[];
};

const sampleItinerary: Itinerary = {
  title: "Paris: 4-Day Escape",
  location: "Paris, France",
  days: [
    {
      day: 1,
      date: "2025-09-16",
      title: "Arrival & Light Exploring",
      activities: [
        { id: "a1", title: "Arrive & Hotel Check-in", time: "09:00 AM", cost: 0, description: "Settle in and freshen up.", type: "stay" },
        { id: "a2", title: "Montmartre Walk & Sacré-Cœur", time: "11:30 AM", cost: 5, description: "Scenic stroll and views of the city.", type: "activity" },
        { id: "a3", title: "Riverside Dinner", time: "07:30 PM", cost: 35, description: "Relaxed dinner by the Seine.", type: "food" }
      ],
    },
    {
      day: 2,
      date: "2025-09-17",
      title: "Classic Sights",
      activities: [
        { id: "b1", title: "Eiffel Tower (summit)", time: "09:00 AM", cost: 28, description: "Book timed entry.", type: "activity" },
        { id: "b2", title: "Louvre (highlights)", time: "12:00 PM", cost: 17, description: "See the Mona Lisa and highlights.", type: "activity" },
        { id: "b3", title: "Picnic at Tuileries", time: "03:30 PM", cost: 12, description: "Grab pastries and chill.", type: "food" }
      ],
    },
    {
      day: 3,
      date: "2025-09-18",
      title: "Day Trip",
      activities: [
        { id: "c1", title: "Versailles Tour", time: "08:30 AM", cost: 60, description: "Train + palace entry.", type: "activity" },
        { id: "c2", title: "Gardens & Bikes", time: "01:30 PM", cost: 10, description: "Rent a bike and roam the gardens.", type: "activity" }
      ],
    },
    {
      day: 4,
      date: "2025-09-19",
      title: "Local Flavor & Departure",
      activities: [
        { id: "d1", title: "Local Market & Brunch", time: "09:00 AM", cost: 18, description: "Fresh local food.", type: "food" },
        { id: "d2", title: "Checkout & Airport Transfer", time: "01:00 PM", cost: 45, description: "Leave with memories.", type: "other" }
      ],
    },
  ],
};

// Pop-up types and dummy data
type PopupType = "hotel" | "ticket" | "alert";
type PopupData = {
  id: string;
  type: PopupType;
  title: string;
  message: string;
  action?: string;
  url?: string;
};

const dummyPopups: PopupData[] = [
  {
    id: "hotel1",
    type: "hotel",
    title: "Hotel Suggestion",
    message: "Stay at Hôtel Le Meurice, 5-star luxury in Paris. Avg. €320/night.",
    action: "View Hotel",
    url: "#"
  },
  {
    id: "ticket1",
    type: "ticket",
    title: "Train Ticket",
    message: "Book TGV to Versailles for Day 3. Only €18 round-trip.",
    action: "Book Train",
    url: "#"
  },
  {
    id: "alert1",
    type: "alert",
    title: "Weather Alert",
    message: "Rain expected on Day 2. Carry an umbrella!",
    action: "OK"
  }
];

// Animated pop-up component
const SidePopup: React.FC<{
  popup: PopupData;
  onClose: () => void;
}> = ({ popup, onClose }) => {
  const gradients = {
    hotel: "bg-gradient-to-r from-purple-900 via-purple-700 to-purple-500",
    ticket: "bg-gradient-to-r from-purple-800 via-purple-600 to-purple-400",
    alert: "bg-gradient-to-r from-purple-700 via-purple-400 to-purple-200 text-gray-900"
  };
  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`shadow-2xl rounded-xl px-5 py-4 mb-3 w-[340px] ${gradients[popup.type]} text-white relative pointer-events-auto border border-white/10`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-2 mb-2">
        <div>{popupIcons[popup.type]}</div>
        <div className="font-bold text-lg">{popup.title}</div>
        <button
          onClick={onClose}
          className="ml-auto text-white/80 hover:text-white"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="text-sm mb-2">{popup.message}</div>
      {popup.action && (
        <a
          href={popup.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-1 px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-xs font-semibold"
        >
          {popup.action}
        </a>
      )}
    </motion.div>
  );
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 180, damping: 18 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
};

const arrowVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, rotate: [0, 8, -6, 0], transition: { duration: 0.7, repeat: 0 } },
};

const budgetTypes = [
  { key: "activity", label: "Activities" },
  { key: "stay", label: "Stay" },
  { key: "food", label: "Food" },
  { key: "other", label: "Other" },
];

const ItineraryViewer: React.FC<{ data?: Itinerary }> = ({ data = sampleItinerary }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [budgetDropdown, setBudgetDropdown] = useState(false);
  const [popups, setPopups] = useState<PopupData[]>([]);
  const autoRef = useRef<number | null>(null);

  const days = data.days || [];

  // Budget breakdown for current day
  const budgetBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    budgetTypes.forEach(bt => breakdown[bt.key] = 0);
    days[activeDayIndex]?.activities.forEach(a => {
      breakdown[a.type ?? "other"] += a.cost ?? 0;
    });
    return breakdown;
  }, [activeDayIndex, days]);

  const dayTotal = (d: Day) => d.activities.reduce((s, a) => s + (a.cost || 0), 0);
  const grandTotal = useMemo(() => days.reduce((s, d) => s + dayTotal(d), 0), [days]);

  useEffect(() => {
    if (playing) {
      autoRef.current = window.setInterval(() => {
        setActiveDayIndex(i => (i + 1 < days.length ? i + 1 : 0));
      }, 2000);
    } else {
      if (autoRef.current) {
        clearInterval(autoRef.current);
        autoRef.current = null;
      }
    }
    return () => {
      if (autoRef.current) {
        clearInterval(autoRef.current);
        autoRef.current = null;
      }
    };
  }, [playing, days.length]);

  const next = () => setActiveDayIndex(i => Math.min(i + 1, days.length - 1));
  const prev = () => setActiveDayIndex(i => Math.max(i - 1, 0));

  // Pop-up logic
  const showPopup = (popup: PopupData) => {
    setPopups(prev => [...prev, popup]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== popup.id));
    }, 5000);
  };

  // Progress bar
  const progress = ((activeDayIndex + 1) / days.length) * 100;

  return (
    <div className="min-h-screen p-0  backdrop-blur-lg border border-gray-200 text-gray-900 relative font-sans">
      {/* Popups container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col items-end pointer-events-none">
        <AnimatePresence>
          {popups.map(popup => (
            <SidePopup
              key={popup.id}
              popup={popup}
              onClose={() => setPopups(prev => prev.filter(p => p.id !== popup.id))}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="sticky top-0 z-40 w-full h-2 bg-purple-900">
        <motion.div
          className="h-2 bg-gradient-to-r from-purple-600 via-purple-400 to-purple-200"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        {/* Demo buttons for popups */}
        <div className="flex gap-2 mb-4">
          <button
            className="px-3 py-1 rounded bg-purple-700 text-white text-xs shadow hover:bg-purple-800"
            onClick={() => showPopup(dummyPopups[0])}
          >
            Suggest Hotel
          </button>
          <button
            className="px-3 py-1 rounded bg-purple-600 text-white text-xs shadow hover:bg-purple-700"
            onClick={() => showPopup(dummyPopups[1])}
          >
            Book Train
          </button>
          <button
            className="px-3 py-1 rounded bg-purple-400 text-gray-900 text-xs shadow hover:bg-purple-500"
            onClick={() => showPopup(dummyPopups[2])}
          >
            Show Alert
          </button>
        </div>

        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white drop-shadow">🌍 {data.title}</h1>
            <p className="text-xs text-purple-200 mt-1">{data.location} • {days.length} days • Est: €{grandTotal}</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setPlaying(p => !p)}
              aria-label={playing ? "Pause autoplay" : "Play autoplay"}
              className="flex items-center gap-1 px-2 py-1 rounded bg-purple-900 hover:bg-purple-800 transition"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={prev}
              aria-label="Previous day"
              className="p-2 rounded bg-purple-900 hover:bg-purple-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={next}
              aria-label="Next day"
              className="p-2 rounded bg-purple-900 hover:bg-purple-800"
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </header>

        {/* Days index */}
        <div className="flex items-center gap-2 mb-6 justify-center">
          {days.map((d, idx) => {
            const badge = getDayBadge(d);
            return (
              <motion.button
                key={d.day}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setActiveDayIndex(idx); setPlaying(false); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all
                  ${idx === activeDayIndex ? "bg-gradient-to-br from-purple-700 via-purple-500 to-purple-300 text-white shadow-lg" : "bg-purple-900 text-purple-200 hover:bg-purple-800"}
                `}
                style={{ outline: idx === activeDayIndex ? "2px solid #a78bfa" : "none" }}
                aria-label={`Go to day ${d.day}`}
              >
                {d.day}
                <span className={`absolute -top-2 -right-2 ${badge.color} text-white px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1`}>
                  {badge.icon} {badge.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Map */}
        <div className="mb-8 rounded-xl overflow-hidden border border-purple-900 shadow-lg">
          <MapContainer
            center={tripLocation}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: "220px", width: "100%" }}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={tripLocation} icon={L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", iconSize: [32, 32] })}>
              <LeafletPopup>
                <strong>{data.location}</strong>
              </LeafletPopup>
            </Marker>
            {dayPins.map((pin, i) => (
              <Marker key={i} position={pin} icon={L.icon({ iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png", iconSize: [24, 24] })}>
                <LeafletPopup>
                  <span>Day {i + 1}: {pin.label}</span>
                </LeafletPopup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Animated Day View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDayIndex}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={containerVariants}
            className="relative"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-lg font-bold">{days[activeDayIndex].title || `Day ${days[activeDayIndex].day}`}</h2>
                <p className="text-xs text-purple-200">{days[activeDayIndex].date}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  whileTap={{ scale: 0.97 }}
                  className="relative"
                >
                  <button
                    onClick={() => setBudgetDropdown(b => !b)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-purple-900 hover:bg-purple-800 text-sm"
                    aria-label="Show budget breakdown"
                  >
                    €{dayTotal(days[activeDayIndex])}
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                  <AnimatePresence>
                    {budgetDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 z-10 bg-purple-950 border border-purple-900 rounded shadow-lg p-3 min-w-[140px]"
                      >
                        {budgetTypes.map(bt => (
                          <div key={bt.key} className="flex justify-between text-xs py-1 text-purple-200">
                            <span>{bt.label}</span>
                            <span>€{budgetBreakdown[bt.key]}</span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            <motion.div className="space-y-4" variants={containerVariants}>
              {days[activeDayIndex].activities.map((act, i) => (
                <motion.div key={act.id} variants={cardVariants}>
                  <div className="flex gap-3 items-start bg-purple-950 border border-purple-900 rounded-xl p-3 shadow hover:shadow-md transition">
                    {/* left: time */}
                    <div className="w-14 flex-shrink-0 flex flex-col items-center">
                      <div className="rounded bg-gradient-to-br from-purple-700 via-purple-500 to-purple-300 text-white w-10 h-10 flex items-center justify-center font-semibold shadow">
                        {act.time ? act.time.split(" ")[0] : `#${i + 1}`}
                      </div>
                      <div className="mt-1 text-[10px] text-purple-200">{act.time}</div>
                    </div>
                    {/* center: details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-semibold text-white">{act.title}</h3>
                          {act.description && <p className="text-xs text-purple-200 mt-1">{act.description}</p>}
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-purple-200">Cost</div>
                          <div className="text-sm font-semibold">€{act.cost ?? 0}</div>
                        </div>
                      </div>
                      {/* optional image */}
                      {act.image && (
                        <div className="mt-2">
                          <img src={act.image} alt={act.title} className="w-full rounded object-cover h-28" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Arrow + transition indicator */}
        <div className="flex items-center justify-center mt-4">
          <AnimatePresence>
            {activeDayIndex < days.length - 1 && (
              <motion.div
                key={`arrow-${activeDayIndex}`}
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={arrowVariants}
                className="flex items-center gap-2"
              >
                <ArrowDown className="w-6 h-6 text-purple-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer summary */}
        <footer className="mt-10 bg-purple-950 border border-purple-900 rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-purple-200">Trip Total</div>
            <div className="text-xl font-bold">€{grandTotal}</div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => { setActiveDayIndex(0); setPlaying(false); }}
              className="px-3 py-1 bg-purple-900 rounded hover:bg-purple-800 text-sm"
            >
              Restart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => window.print()}
              className="px-3 py-1 bg-gradient-to-r from-purple-700 via-purple-500 to-purple-300 rounded text-white shadow hover:opacity-90 text-sm"
            >
              Print / Export
            </motion.button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ItineraryViewer;
