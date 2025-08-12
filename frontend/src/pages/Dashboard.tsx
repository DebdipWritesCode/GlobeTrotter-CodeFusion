import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import type { RootState } from "@/redux/store";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  Search,
  SortAsc,
  Group,
  DollarSign,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SparklesCore } from "@/components/ui/sparkles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  Calendar,
  ImageIcon,
  TrendingUp,
  Camera,
  Coffee,
  Utensils,
  Music,
  Bike,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Earth from "@/components/ui/globe";
import Typewriter from "@/components/ui/typewriter";
import Tilt from "@/components/ui/tilt";
import confetti from "canvas-confetti";
import Reveal from "@/components/ui/reveal";
import heroImg from "@/assets/images/chris-holgersson-iQKoSI25Lws-unsplash.jpg";
import { toast } from "react-toastify";
// Local image assets for reliable loading
import imgAliKazal from "@/assets/images/ali-kazal-YsrWdRIt5cs-unsplash.jpg";
import imgAndreBenz from "@/assets/images/andre-benz-cXU6tNxhub0-unsplash.jpg";
import imgCharlotteNoelle from "@/assets/images/charlotte-noelle-98WPMlTl5xo-unsplash.jpg";
import imgChris2 from "@/assets/images/chris-holgersson-iQKoSI25Lws-unsplash-2.jpg";
import imgDavidKohler from "@/assets/images/david-kohler-VFRTXGw1VjU-unsplash.jpg";
import imgJeanValjean from "@/assets/images/jean-valjean-bUIXMVbHuHw-unsplash.jpg";
import imgKajaReichardt from "@/assets/images/kaja-reichardt-kLA5yRv0Gd4-unsplash.jpg";
import imgNickSeagrave from "@/assets/images/nick-seagrave-1tpLdmxki-c-unsplash.jpg";
import imgNiklasOhlrogge1 from "@/assets/images/niklas-ohlrogge-niamoh-de-BkmdKnuAZtw-unsplash (1).jpg";
import imgSydSujuaan from "@/assets/images/syd-sujuaan-AjtAJ-FK0Aw-unsplash.jpg";
import imgTakashiMiyazaki from "@/assets/images/takashi-miyazaki-64ajtpEzlYc-unsplash.jpg";
import imgWhatsApp from "@/assets/images/WhatsApp Image 2025-08-12 at 10.57.40_d52ccf69.jpg";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

// React-Leaflet removed for this section to avoid hidden-container sizing pitfalls; using imperative Leaflet below

// Fix Leaflet marker icon issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Minimal imperative Leaflet map (per docs) to avoid rendering pitfalls
function PlainLeafletMap({
  center,
  markers,
  polyline,
}: {
  center: [number, number];
  markers: { position: [number, number]; popup?: string }[];
  polyline?: [number, number][];
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layersRef = useRef<{ markers?: any; line?: any } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!mapRef.current) {
      // Create the map
      mapRef.current = L.map(containerRef.current).setView(center, 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Small delay to ensure size after tab visibility
      setTimeout(() => {
        try {
          mapRef.current?.invalidateSize();
        } catch {
          // no-op
        }
      }, 120);
    } else {
      // Recenter smoothly if map already exists
      mapRef.current.setView(center);
    }

    // Clear previous layers
    if (layersRef.current?.markers) {
      layersRef.current.markers.remove();
    }
    if (layersRef.current?.line) {
      layersRef.current.line.remove();
    }

    // Add markers
    const group = L.layerGroup();
    markers.forEach((m) => {
      const marker = L.marker(m.position);
      if (m.popup) marker.bindPopup(m.popup);
      marker.addTo(group);
    });
    group.addTo(mapRef.current!);

    // Add polyline if provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let line: any | undefined;
    if (polyline && polyline.length > 1) {
      line = L.polyline(polyline, {
        color: "#4F46E5",
        weight: 3,
        opacity: 0.8,
        dashArray: "5, 10",
      }).addTo(mapRef.current!);
      // Fit bounds to polyline for better view
      try {
        mapRef.current!.fitBounds(line.getBounds(), { padding: [20, 20] });
      } catch {
        // no-op
      }
    }

    layersRef.current = { markers: group, line };

    return () => {
      // Clean up only on full unmount
      // Do not remove map here unless component unmounts
    };
    // Build simple, stable dependency keys
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center, JSON.stringify(markers), JSON.stringify(polyline || [])]);

  useEffect(() => {
    return () => {
      try {
        mapRef.current?.remove();
      } catch {
        // no-op
      }
      mapRef.current = null;
      layersRef.current = null;
    };
  }, []);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
}

type City = {
  _id: string;
  name: string;
  country: string;
  costIndex?: number;
  popularityScore?: number;
  images?: string[];
  coordinates?: [number, number]; // [latitude, longitude]
};

type TripCity = {
  cityId: City | string; // populated City or id
  startDate: string;
  endDate: string;
  order: number;
};

type Trip = {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "ongoing" | "completed";
  cities: TripCity[];
};

type Activity = {
  _id: string;
  name: string;
  description?: string;
  cityId: { _id: string; name: string; country: string } | string;
  category?: string;
  cost?: number;
  duration?: number;
  images?: string[];
};

// City shape used for mapping with optional itinerary dates/order
type MapCity = City & { startDate?: string; endDate?: string; order?: number };

// Add constant for destination categories
const DESTINATION_CATEGORIES = [
  {
    key: "beach",
    label: "Beach Escapes",
    color: "from-sky-500 to-cyan-500",
    icon: "🏖️",
  },
  {
    key: "city",
    label: "City Breaks",
    color: "from-indigo-500 to-purple-500",
    icon: "🏙️",
  },
  {
    key: "nature",
    label: "Nature & Trails",
    color: "from-emerald-500 to-lime-500",
    icon: "🏞️",
  },
  {
    key: "culture",
    label: "Culture & History",
    color: "from-amber-500 to-red-500",
    icon: "🏛️",
  },
];

// Local image pool for general fallbacks (All category, Inspiration, etc.)
const LOCAL_IMAGE_POOL: string[] = [
  imgNickSeagrave,
  imgAliKazal,
  imgSydSujuaan,
  imgJeanValjean,
  imgAndreBenz,
  imgDavidKohler,
  imgCharlotteNoelle,
  imgChris2,
  imgKajaReichardt,
  imgNiklasOhlrogge1,
  imgTakashiMiyazaki,
  imgWhatsApp,
];

// Simple fallback pools to ensure cards always appear by category
// Includes realistic, category-appropriate image URLs
const FALLBACK_BY_CATEGORY: Record<
  string,
  { _id: string; name: string; country: string; images?: string[] }[]
> = {
  beach: [
    {
      _id: "fb-beach-1",
      name: "Maldives Atoll",
      country: "Maldives",
  images: [imgNickSeagrave]
    },
    {
      _id: "fb-beach-2",
      name: "Bora Bora",
      country: "French Polynesia",
  images: [imgAliKazal]
    },
    {
      _id: "fb-beach-3",
      name: "Phi Phi Islands",
      country: "Thailand",
  images: [imgSydSujuaan]
    },
    {
      _id: "fb-beach-4",
      name: "Bondi Beach",
      country: "Australia",
  images: [imgJeanValjean]
    },
  ],
  city: [
    {
      _id: "fb-city-1",
      name: "Tokyo",
      country: "Japan",
  images: [imgAndreBenz]
    },
    {
      _id: "fb-city-2",
      name: "Dubai",
      country: "United Arab Emirates",
  images: [imgDavidKohler]
    },
    {
      _id: "fb-city-3",
      name: "Singapore",
      country: "Singapore",
  images: [imgCharlotteNoelle]
    },
    {
      _id: "fb-city-4",
      name: "Hong Kong",
      country: "China",
  images: [imgChris2]
    },
  ],
  nature: [
    {
      _id: "fb-nature-1",
      name: "Banff National Park",
      country: "Canada",
  images: [imgKajaReichardt]
    },
    {
      _id: "fb-nature-2",
      name: "Swiss Alps",
      country: "Switzerland",
  images: [imgNiklasOhlrogge1]
    },
    {
      _id: "fb-nature-3",
      name: "Yosemite Valley",
      country: "United States",
  images: [imgWhatsApp]
    },
    {
      _id: "fb-nature-4",
      name: "Patagonia",
      country: "Argentina",
  images: [imgCharlotteNoelle]
    },
  ],
  culture: [
    {
      _id: "fb-culture-1",
      name: "Rome",
      country: "Italy",
  images: [imgDavidKohler]
    },
    {
      _id: "fb-culture-2",
      name: "Athens",
      country: "Greece",
  images: [imgChris2]
    },
    {
      _id: "fb-culture-3",
      name: "Kyoto Temples",
      country: "Japan",
  images: [imgTakashiMiyazaki]
    },
    {
      _id: "fb-culture-4",
      name: "Machu Picchu",
      country: "Peru",
  images: [imgJeanValjean]
    },
  ],
};

const dateFmt = (d: string | Date) => {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const daysBetween = (a: string, b: string) => {
  const diff = Math.ceil(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
  );
  return Math.max(diff, 1);
};

const Dashboard = () => {
  const navigate = useNavigate();
  // Extract token from Redux state
  const {
    loading: authLoading,
    name,
    accessToken,
  } = useSelector((s: RootState) => s.auth);

  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popularity" | "cost" | "az">(
    "popularity"
  );
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [categoryCounts] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem("dash.categoryCounts");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed reading categoryCounts from storage", e);
    }
    // Seed random desired counts per category (2-4)
    const counts: Record<string, number> = {};
    for (const c of DESTINATION_CATEGORIES) {
      counts[c.key] = 2 + Math.floor(Math.random() * 3); // 2..4
    }
    return counts;
  });
  const [groupBy, setGroupBy] = useState<"none" | "region" | "month">("region");
  const [inspiration, setInspiration] = useState<
    { title: string; desc?: string; img?: string }[]
  >([]);
  const [tripsPage, setTripsPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("discover");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Persist chosen category and counts
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dash.category");
      if (saved) setCategoryFilter(saved);
    } catch (e) {
      console.warn("Failed reading category from storage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("dash.category", categoryFilter);
    } catch (e) {
      console.warn("Failed saving category to storage", e);
    }
  }, [categoryFilter]);

  useEffect(() => {
    try {
      localStorage.setItem("dash.categoryCounts", JSON.stringify(categoryCounts));
    } catch (e) {
      console.warn("Failed saving categoryCounts to storage", e);
    }
  }, [categoryCounts]);
  const tripsPerPage = 6;

  // State for city explore dialog
  const [dialogCity, setDialogCity] = useState<City | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Single consolidated useEffect for API calls
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // Debug auth token from Redux (not localStorage)
    console.log("Auth token status:", accessToken ? "Present" : "Missing");

    Promise.all([
      // Remove /api prefix since it's in the baseURL
      api.get("/cities").catch((error) => {
        console.error("Error fetching cities:", error);
        toast.error("Failed to load cities");
        return { data: [] };
      }),
      api.get("/trips/user").catch((error) => {
        console.error(
          "Error fetching trips:",
          error.response?.status,
          error.response?.data
        );
        toast.error("Failed to load trips");
        return { data: [] };
      }),
      api.get("/activities").catch((error) => {
        console.error("Error fetching activities:", error);
        // Activities are optional; fall back gracefully
        return { data: [] };
      }),
    ])
      .then(([citiesRes, tripsRes, activitiesRes]) => {
        if (!mounted) return;

        // Use mock data if no real data is available
        const citiesData =
          citiesRes.data?.length > 0 ? citiesRes.data : MOCK_CITIES;
        const tripsData =
          tripsRes.data?.length > 0 ? tripsRes.data : MOCK_TRIPS;
        const activitiesData =
          activitiesRes.data?.length > 0 ? activitiesRes.data : MOCK_ACTIVITIES;

        setActivities(activitiesData);
        setTrips(tripsData);
        setCities(citiesData);

        // Add mock coordinates for cities if they don't have them
        const citiesWithCoords = citiesData.map((city: City) => {
          if (!city.coordinates) {
            // Generate random coordinates near popular areas
            const baseCoords: Record<
              | "Europe"
              | "Asia"
              | "North America"
              | "South America"
              | "Africa"
              | "Australia",
              [number, number]
            > = {
              Europe: [48.8566, 2.3522], // Paris
              Asia: [31.2304, 121.4737], // Shanghai
              "North America": [40.7128, -74.006], // New York
              "South America": [-23.5505, -46.6333], // São Paulo
              Africa: [-33.9249, 18.4241], // Cape Town
              Australia: [-33.8688, 151.2093], // Sydney
            };

            // Simple region inference based on country
            let region:
              | "Europe"
              | "Asia"
              | "North America"
              | "South America"
              | "Africa"
              | "Australia" = "Europe";
            const country = city.country.toLowerCase();
            if (
              ["china", "japan", "india", "thailand", "vietnam"].some((c) =>
                country.includes(c)
              )
            ) {
              region = "Asia";
            } else if (
              ["usa", "canada", "mexico"].some((c) => country.includes(c))
            ) {
              region = "North America";
            } else if (
              ["brazil", "argentina", "chile", "peru"].some((c) =>
                country.includes(c)
              )
            ) {
              region = "South America";
            } else if (
              ["australia", "new zealand"].some((c) => country.includes(c))
            ) {
              region = "Australia";
            } else if (
              ["egypt", "morocco", "south africa"].some((c) =>
                country.includes(c)
              )
            ) {
              region = "Africa";
            }

            const [baseLat, baseLng] = baseCoords[region];
            // Add random offset (±2 degrees)
            const lat = baseLat + (Math.random() * 4 - 2);
            const lng = baseLng + (Math.random() * 4 - 2);

            return { ...city, coordinates: [lat, lng] };
          }
          return city;
        });

        setCities(citiesWithCoords);

        // Process trips data
        // Map string cityIds to actual city objects for mock data
        const processedTrips = tripsData.map((trip: Trip) => {
          if (trip.cities) {
            const updatedCities = trip.cities.map((tc) => {
              if (typeof tc.cityId === "string") {
                const cityObj = citiesWithCoords.find(
                  (c: City) => c._id === tc.cityId
                );
                if (cityObj) {
                  return { ...tc, cityId: cityObj };
                }
              }
              return tc;
            });
            return { ...trip, cities: updatedCities };
          }
          return trip;
        });

        // sort trips by start date desc by default
        const tt = processedTrips.sort(
          (a: Trip, b: Trip) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setTrips(tt);

        console.log("Processed trips:", tt);

        // Build inspiration items: prefer activities with images, else top city images
        const actItems = activitiesData
          .filter(
            (a: Activity) => Array.isArray(a.images) && a.images.length > 0
          )
          .slice(0, 10)
          .map((a: Activity) => ({
            title: a.name,
            desc:
              typeof a.cityId === "string"
                ? undefined
                : `${a.cityId.name}, ${a.cityId.country}`,
            img: a.images?.[0],
          }));
        const cityItems = citiesWithCoords
          .filter((c: City) => Array.isArray(c.images) && c.images.length > 0)
          .slice(0, 10)
          .map((c: City) => ({
            title: c.name,
            desc: c.country,
            img: c.images?.[0],
          }));
        setInspiration(actItems.length ? actItems : cityItems);
        setActivities(activitiesData);

        console.log("Fetched cities:", citiesData.length);
        console.log("Fetched trips:", tripsData.length);
        console.log("Fetched activities:", activitiesData.length);

        setActivities(activitiesData);
        setTrips(processedTrips);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [accessToken]); // Add accessToken as dependency

  // Build itinerary-based city path for the map (from sections -> activities -> cities)
  const [itineraryCities, setItineraryCities] = useState<MapCity[]>([]);

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    cities.forEach((c) => set.add(c.country));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [cities]);

  const filteredCities = useMemo(() => {
    let list = [...cities];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
      );
    }

    // Country filter
    if (countryFilter !== "all") {
      list = list.filter((c) => c.country === countryFilter);
    }

    // Category filter (this is mocked since we don't have category data)
    if (categoryFilter !== "all") {
      // In a real app, you'd filter by actual category data
      // For now, we'll just filter based on some simple rules
      const mockCategoryMapping: Record<string, (city: City) => boolean> = {
        beach: (city) => {
          const name = city.name.toLowerCase();
          return (
            name.includes("beach") ||
            name.includes("coast") ||
            ["maldives", "bali", "cancun", "hawaii"].some((term) =>
              name.includes(term)
            )
          );
        },
        city: (city) => {
          return city.popularityScore ? city.popularityScore > 70 : false;
        },
        nature: (city) => {
          const name = city.name.toLowerCase();
          return (
            name.includes("park") ||
            name.includes("mountain") ||
            name.includes("lake") ||
            ["alps", "forest", "canyon"].some((term) => name.includes(term))
          );
        },
        culture: (city) => {
          // For demo, alternate cities for culture category
          return city.costIndex ? city.costIndex > 60 : false;
        },
      };

      const filterFn = mockCategoryMapping[categoryFilter];
      if (filterFn) {
        list = list.filter(filterFn);
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "cost":
        list.sort((a, b) => (a.costIndex ?? 0) - (b.costIndex ?? 0));
        break;
      case "az":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort(
          (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
        );
    }

    return list;
  }, [cities, query, countryFilter, categoryFilter, sortBy]);

  // Calculate pagination for trips
  const paginatedTrips = () => {
    const startIndex = (tripsPage - 1) * tripsPerPage;
    return trips.slice(startIndex, startIndex + tripsPerPage);
  };

  console.log("Paginated trips:", {
    trips: paginatedTrips(),
    currentPage: tripsPage,
  });

  const totalTripPages = Math.ceil(trips.length / tripsPerPage);

  // Get recent or ongoing trip for the map
  const mapTrip = useMemo(() => {
    const now = new Date();

    // First try to find an ongoing trip
    const ongoing = trips.find(
      (t) =>
        t.status === "ongoing" &&
        new Date(t.startDate) <= now &&
        new Date(t.endDate) >= now
    );

    if (ongoing) return ongoing;

    // Otherwise, find a recent trip (completed within the last week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recent = trips.find(
      (t) =>
        t.status === "completed" &&
        new Date(t.endDate) >= oneWeekAgo &&
        new Date(t.endDate) <= now
    );

    if (recent) return recent;

    // Otherwise return the most recent upcoming trip
    return trips
      .filter((t) => t.status === "upcoming")
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0];
  }, [trips]);

  // Build itinerary-based city path for the map (from sections -> activities -> cities)
  useEffect(() => {
    let cancelled = false;
    const loadSectionsForTrip = async () => {
      if (!mapTrip) {
        setItineraryCities([]);
        return;
      }
      try {
        const res = await api
          .get(`/sections/trip/${mapTrip._id}`)
          .catch(() => ({ data: [] }));
        const sections: {
          startDate: string;
          endDate: string;
          activities?: { activityId: string }[];
        }[] = res.data || [];

        if (!sections.length) {
          if (!cancelled) setItineraryCities([]);
          return;
        }

        const findCity = (idOrName?: string, country?: string) => {
          if (!idOrName) return undefined;
          const byId = cities.find((c) => c._id === idOrName);
          if (byId?.coordinates) return byId;
          const byName = cities.find(
            (c) => c.name === idOrName && (!country || c.country === country)
          );
          return byName?.coordinates ? byName : undefined;
        };

        type Agg = { city: City; start: string; end: string; firstTs: number };
        const aggMap = new Map<string, Agg>();

        const sortedSections = [...sections].sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        for (const sec of sortedSections) {
          const firstTs = new Date(sec.startDate).getTime();
          for (const ref of sec.activities || []) {
            const act = activities.find((a) => a._id === ref.activityId);
            if (!act) continue;
            let cityDoc: City | undefined;
            if (typeof act.cityId === "string") {
              cityDoc = findCity(act.cityId);
            } else {
              const obj = act.cityId as {
                _id: string;
                name: string;
                country: string;
              };
              const id = obj?._id;
              const nm = obj?.name;
              const ct = obj?.country;
              cityDoc = findCity(id || nm, ct);
            }
            if (!cityDoc || !Array.isArray(cityDoc.coordinates)) continue;

            const key = cityDoc._id;
            const existing = aggMap.get(key);
            if (existing) {
              existing.start = new Date(
                Math.min(
                  new Date(existing.start).getTime(),
                  new Date(sec.startDate).getTime()
                )
              ).toISOString();
              existing.end = new Date(
                Math.max(
                  new Date(existing.end).getTime(),
                  new Date(sec.endDate).getTime()
                )
              ).toISOString();
              existing.firstTs = Math.min(existing.firstTs, firstTs);
            } else {
              aggMap.set(key, {
                city: cityDoc,
                start: sec.startDate,
                end: sec.endDate,
                firstTs,
              });
            }
          }
        }

        const ordered: MapCity[] = Array.from(aggMap.values())
          .sort((a, b) => a.firstTs - b.firstTs)
          .map((x) => ({
            ...(x.city as City),
            startDate: x.start,
            endDate: x.end,
          }));

        if (!cancelled) setItineraryCities(ordered);
      } catch (e) {
        console.error("Failed to build itinerary for map:", e);
        if (!cancelled) setItineraryCities([]);
      }
    };

    loadSectionsForTrip();
    return () => {
      cancelled = true;
    };
  }, [mapTrip, activities, cities]);

  // Extract cities with coordinates from the map trip (fallback when no itinerary)
  const tripCities: MapCity[] = useMemo(() => {
    if (!mapTrip) return [];

    const ensureWithCoords = (
      cityLike: Partial<City> & {
        _id?: string;
        name?: string;
        country?: string;
      }
    ) => {
      if (cityLike && Array.isArray((cityLike as City).coordinates))
        return cityLike as City;
      if (cityLike?._id) {
        const found = cities.find((c) => c._id === cityLike._id);
        if (found?.coordinates) return found;
      }
      if (cityLike?.name) {
        const foundByName = cities.find(
          (c) =>
            c.name === cityLike.name ||
            (cityLike.country &&
              c.name === cityLike.name &&
              c.country === cityLike.country)
        );
        if (foundByName?.coordinates) return foundByName;
      }
      return null;
    };

    return mapTrip.cities
      .map((tc) => {
        if (typeof tc.cityId === "string") {
          const city = cities.find((c) => c._id === tc.cityId);
          if (city && city.coordinates) {
            return {
              ...city,
              startDate: tc.startDate,
              endDate: tc.endDate,
              order: tc.order,
            } as MapCity;
          }
          return null;
        } else {
          const withCoords = ensureWithCoords(tc.cityId as City);
          if (withCoords && withCoords.coordinates) {
            return {
              ...withCoords,
              startDate: tc.startDate,
              endDate: tc.endDate,
              order: tc.order,
            } as MapCity;
          }
        }
        return null;
      })
      .filter((c): c is MapCity => Boolean(c))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [mapTrip, cities]);

  // Prefer itinerary cities if present; else fall back to trip cities; else mock few cities
  const chosenCities: MapCity[] = useMemo(() => {
    if (itineraryCities.length) return itineraryCities;
    if (tripCities.length) return tripCities;
    // Mock fallback if nothing else is available
    return MOCK_CITIES.slice(0, 3) as MapCity[];
  }, [itineraryCities, tripCities]);

  // Find map center coordinates
  const mapCenter = useMemo(() => {
    if (chosenCities.length === 0) return [20, 0]; // Default center

    // Calculate average coordinates
    const total = chosenCities.reduce(
      (acc, city) => {
        if (city.coordinates) {
          acc[0] += city.coordinates[0];
          acc[1] += city.coordinates[1];
        }
        return acc;
      },
      [0, 0]
    );

    return [total[0] / chosenCities.length, total[1] / chosenCities.length];
  }, [chosenCities]);

  const welcomeTitle = useMemo(() => {
    const first = name?.split(" ")[0] || "Trotter";
    return `Welcome, ${first}!`;
  }, [name]);

  const estBudgetForTrip = (t: Trip) => {
    // estimate from average city costIndex * days * base
    const days = daysBetween(t.startDate, t.endDate);
    const cityObjs = t.cities
      .map((c) => (typeof c.cityId === "string" ? undefined : c.cityId))
      .filter(Boolean) as City[];
    const avgCostIdx = cityObjs.length
      ? cityObjs.reduce((s, c) => s + (c.costIndex ?? 50), 0) / cityObjs.length
      : 50;
    const estimate = Math.round(avgCostIdx * days * 10); // arbitrary factor
    return estimate;
  };

  if (authLoading || loading) return <Loading />;

  const fireConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.2 },
    });
  };

  // Handle opening city explore dialog
  const handleExploreCity = (city: City) => {
    setDialogCity(city);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] px-4 sm:px-6 md:px-10 pb-24">
      {/* Image-based Hero banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-black/5">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Travel banner"
            className="h-full w-full object-cover opacity-90"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
        </div>
        <div className="relative z-10 p-6 sm:p-8 md:p-10 text-white">
          <Tilt glare className="inline-block">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight drop-shadow-[0_6px_20px_rgba(0,0,0,0.45)]">
              {welcomeTitle}
            </h1>
          </Tilt>
          <p className="mt-3 max-w-2xl text-white/90 text-base sm:text-lg">
            <Typewriter
              words={[
                "Plan your next escape.",
                "Build multi-city itineraries.",
                "Track budgets with ease.",
                "Share adventures with friends.",
              ]}
              typingSpeed={55}
              deletingSpeed={35}
              pauseBetweenWords={900}
            />
          </p>
          <div className="mt-6 flex gap-3 flex-wrap">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                fireConfetti();
                navigate("/create-trip");
              }}
            >
              Plan New Trip
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/trips">View My Trips</Link>
            </Button>
          </div>
        </div>
        <SparklesCore
          className="absolute inset-0 z-0 opacity-30"
          background="transparent"
          particleColor="#ffffff"
          particleDensity={50}
          maxSize={3}
          minSize={1}
          speed={2}
        />
      </div>

      {/* Budget highlights strip - ONLY SHOW THIS ONCE */}
      <Highlights trips={trips} estimate={estBudgetForTrip} />

      {/* Search and controls */}
      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            className="pl-10 h-11"
            placeholder="Search destinations or cities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select
          value={sortBy}
          onValueChange={(v) => setSortBy(v as "popularity" | "cost" | "az")}
        >
          <SelectTrigger className="h-11">
            <SortAsc className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="cost">Cost</SelectItem>
            <SelectItem value="az">A-Z</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={countryFilter}
          onValueChange={(v) => setCountryFilter(v)}
        >
          <SelectTrigger className="h-11">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {countryOptions.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "all" ? "All countries" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={groupBy}
          onValueChange={(v) => setGroupBy(v as "none" | "region" | "month")}
        >
          <SelectTrigger className="h-11">
            <Group className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="region">Region</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add tabbed navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="mytrips">My Trips</TabsTrigger>
          <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6 mt-4">
          {/* Earth globe visualization */}
          <TravelMap cities={filteredCities} />

          {/* Destination categories as quick filters */}
          <DestinationCategories
            activeCategory={categoryFilter}
            onSelectCategory={(category) => setCategoryFilter(category)}
          />

          {/* Category showcase cards (now show for 'all' too) */}
          <CategoryShowcase
            categoryKey={categoryFilter}
            cities={filteredCities}
            desiredCount={categoryCounts[categoryFilter] ?? 4}
            onExploreCity={handleExploreCity}
          />

          {/* Dynamic destinations grid with explore functionality */}
          <BrowseDestinations
            cities={filteredCities}
            groupBy={groupBy}
            onExploreCity={handleExploreCity}
          />
        </TabsContent>

        <TabsContent value="mytrips" className="space-y-6 mt-4">
          {/* Trip countdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <NextTripCountdown trips={trips} />
            <TravelStats trips={trips} />
          </div>

          {/* Trip Map with Leaflet - render when on My Trips and client-side; show even with 0 markers */}
          {isClient && activeTab === "mytrips" && mapTrip && (
            <section>
              <div className="flex items-end justify-between mb-3">
                <div>
                  <h2 className="text-xl font-semibold">Itinerary Map</h2>
                  <div className="mt-1 h-1 w-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {mapTrip?.title}
                </div>
              </div>
              <div className="h-80 w-full rounded-lg overflow-hidden border">
                <PlainLeafletMap
                  center={mapCenter as [number, number]}
                  markers={chosenCities
                    .filter((c) => c.coordinates)
                    .map((city) => ({
                      position: city.coordinates as [number, number],
                      popup: `<div><strong>${city.name}</strong><br/>${
                        city.country
                      }${
                        city.startDate
                          ? `<br/><small>${dateFmt(city.startDate)} - ${dateFmt(
                              city.endDate!
                            )}</small>`
                          : ""
                      }</div>`,
                    }))}
                  polyline={chosenCities
                    .filter((c) => c.coordinates)
                    .map((city) => city.coordinates as [number, number])}
                />
              </div>
            </section>
          )}

          {/* Complete trips list with pagination */}
          <AllTrips
            trips={trips}
            currentPage={tripsPage}
            totalPages={totalTripPages}
            onPageChange={(page) => setTripsPage(page)}
          />
        </TabsContent>

        <TabsContent value="inspiration" className="space-y-6 mt-4">
          {/* Travel Inspiration Carousel with explore functionality */}
          <InspirationCarousel
            items={inspiration}
            onExploreItem={(title, desc) => {
              // Find a city that matches this inspiration item
              const city = cities.find(
                (c) => c.name === title || c.name === desc
              );
              if (city) {
                handleExploreCity(city);
              } else {
                toast.info(`Details about "${title}" coming soon!`);
              }
            }}
          />

          {/* Travel tips section updated to use handleExploreCity */}
          <section>
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-xl font-semibold">
                  Travel Tips & Insights
                </h2>
                <div className="mt-1 h-1 w-24 bg-gradient-to-r from-amber-500 to-red-500 rounded-full" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredCities.slice(0, 4).map((city) => (
                <div
                  key={`seasonal-${city._id}`}
                  className="relative h-48 rounded-lg overflow-hidden group"
                >
                  {city.images?.[0] ? (
                    <img
                      src={city.images[0]}
                      alt={city.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <ImagePlaceholder seed={city.name} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-medium">{city.name}</h3>
                    <p className="text-sm">{city.country}</p>
                  </div>
                  <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white">
                    <Sun className="h-4 w-4" />
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleExploreCity(city)}
                  >
                    Explore
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* Floating Plan button */}
      <div className="fixed left-4 bottom-4 z-40">
        <Button
          size="lg"
          className="shadow-lg"
          onClick={() => navigate("/create-trip")}
        >
          + Plan a Trip
        </Button>
      </div>

      {/* City Explore Dialog - separated from the main return for clarity */}
      <CityExploreDialog
        city={dialogCity}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  );
};

function Highlights({
  trips,
  estimate,
}: {
  trips: Trip[];
  estimate: (t: Trip) => number;
}) {
  const now = new Date();
  const upcoming = trips.filter((t) => new Date(t.endDate) >= now);
  const upcomingCount = upcoming.length;
  const totalDays = upcoming.reduce(
    (acc, t) => acc + daysBetween(t.startDate, t.endDate),
    0
  );
  const totalBudget = upcoming.reduce((acc, t) => acc + estimate(t), 0);
  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <Card className="border bg-gradient-to-br from-indigo-50 to-transparent dark:from-indigo-950/30">
        <CardContent className="py-4">
          <div className="text-sm text-muted-foreground">Upcoming trips</div>
          <div className="text-2xl font-semibold">{upcomingCount}</div>
        </CardContent>
      </Card>
      <Card className="border bg-gradient-to-br from-purple-50 to-transparent dark:from-purple-950/30">
        <CardContent className="py-4">
          <div className="text-sm text-muted-foreground">
            Total days planned
          </div>
          <div className="text-2xl font-semibold">{totalDays}</div>
        </CardContent>
      </Card>
      <Card className="border bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Est. total budget
          </div>
          <div className="text-2xl font-semibold">
            ₹ {totalBudget.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;

// Lightweight helper components used within Dashboard
// TravelMap: simple top destinations list (placeholder for interactive map)
function TravelMap({ cities }: { cities: City[] }) {
  // derive top cities by popularity (fallback to name)
  const top = useMemo(() => {
    const copy = [...cities];
    copy.sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
    return copy.slice(0, 6);
  }, [cities]);

  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Explore the Map</h2>
          <div className="mt-1 h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
        </div>
        <Button variant="outline" onClick={() => void 0}>
          Open Full Map
        </Button>
      </div>
      <Reveal
        className="w-full flex items-center justify-center py-4"
        direction="up"
      >
        <Earth className="max-w-[420px]" theta={0.25} dark={1} scale={1.15} />
      </Reveal>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {top.map((c, i) => (
          <Reveal key={`top-city-${c._id}`} delayMs={80 * i}>
            <Tilt glare className="rounded-xl">
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.country}
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(c.popularityScore ?? 50)}
                    </Badge>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground">
                    Approx. cost index:{" "}
                    <span className="font-medium">{c.costIndex ?? 50}</span>
                  </div>
                </CardContent>
              </Card>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// CategoryShowcase: shows a small grid of cities for the selected category with safe fallbacks
function CategoryShowcase({
  categoryKey,
  cities,
  desiredCount,
  onExploreCity,
}: {
  categoryKey: string;
  cities: City[];
  desiredCount: number;
  onExploreCity: (city: City) => void;
}) {
  const label = DESTINATION_CATEGORIES.find((c) => c.key === categoryKey)?.label || "Selected";

  const filterFn: Record<string, (city: City) => boolean> = {
    beach: (city) => {
      const name = city.name.toLowerCase();
      return (
        name.includes("beach") ||
        name.includes("coast") ||
        ["maldives", "bali", "cancun", "hawaii"].some((term) => name.includes(term))
      );
    },
    city: (city) => (city.popularityScore ? city.popularityScore > 70 : false),
    nature: (city) => {
      const name = city.name.toLowerCase();
      return (
        name.includes("park") ||
        name.includes("mountain") ||
        name.includes("lake") ||
        ["alps", "forest", "canyon"].some((term) => name.includes(term))
      );
    },
    culture: (city) => (city.costIndex ? city.costIndex > 60 : false),
  };

  const pool = (filterFn[categoryKey] ? cities.filter(filterFn[categoryKey]) : cities).slice();

  const items: City[] = pool.slice(0, Math.max(0, desiredCount));
  if (items.length < desiredCount) {
    const fallback = FALLBACK_BY_CATEGORY[categoryKey] || [];
    for (let i = 0; i < fallback.length && items.length < desiredCount; i++) {
      const f = fallback[i];
      items.push({
        _id: f._id,
        name: f.name,
        country: f.country,
        images: f.images,
      });
    }
  }

  // If still short or if some items have no images, pad with LOCAL_IMAGE_POOL
  for (let i = 0; i < items.length; i++) {
    if (!items[i].images || items[i].images?.length === 0) {
      items[i].images = [LOCAL_IMAGE_POOL[i % LOCAL_IMAGE_POOL.length]];
    }
  }
  while (items.length < desiredCount) {
    const i = items.length;
    items.push({
      _id: `local-fallback-${categoryKey}-${i}`,
      name: `Discover Spot ${i + 1}`,
      country: "",
      images: [LOCAL_IMAGE_POOL[i % LOCAL_IMAGE_POOL.length]],
    });
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">{label}</h2>
          <div className="mt-1 h-1 w-24 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full" />
        </div>
        <div className="text-sm text-muted-foreground">{items.length} spot{items.length === 1 ? "" : "s"}</div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((c) => (
          <Card key={`cat-${categoryKey}-${c._id}`} className="overflow-hidden">
            <div className="h-28 w-full bg-muted overflow-hidden">
              {c.images?.[0] ? (
                <img src={c.images[0]} alt={c.name} className="h-full w-full object-cover" loading="lazy" referrerPolicy="no-referrer" />
              ) : (
                <ImagePlaceholder seed={`${categoryKey}-${c.name}`} />
              )}
            </div>
            <CardContent className="p-3">
              <div className="font-medium leading-tight">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.country}</div>
              <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => onExploreCity(c)}>
                Explore
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// DestinationCategories: interactive category filters
function DestinationCategories({
  activeCategory,
  onSelectCategory,
}: {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Destination Categories</h2>
          <div className="mt-1 h-1 w-24 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
        {/* "All" category */}
        <Card
          className={`overflow-hidden cursor-pointer transition-all ${
            activeCategory === "all" ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelectCategory("all")}
        >
          <div className="h-1 w-full bg-gradient-to-r from-gray-400 to-gray-600" />
          <CardContent className="p-4 flex items-center justify-between">
            <div className="font-medium">All Categories</div>
            <Badge variant={activeCategory === "all" ? "default" : "outline"}>
              {activeCategory === "all" ? "Selected" : "Select"}
            </Badge>
          </CardContent>
        </Card>

        {/* Other categories */}
        {DESTINATION_CATEGORIES.map((cat) => (
          <Card
            key={cat.key}
            className={`overflow-hidden cursor-pointer transition-all ${
              activeCategory === cat.key ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelectCategory(cat.key)}
          >
            <div className={`h-1 w-full bg-gradient-to-r ${cat.color}`} />
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span role="img" aria-label={cat.label}>
                  {cat.icon}
                </span>
                <span className="font-medium">{cat.label}</span>
              </div>
              <Badge
                variant={activeCategory === cat.key ? "default" : "outline"}
              >
                {activeCategory === cat.key ? "Selected" : "Select"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// BrowseDestinations: dynamic grid of filtered cities (search + sort + filters)
function BrowseDestinations({
  cities,
  groupBy,
  onExploreCity,
}: {
  cities: City[];
  groupBy: "none" | "region" | "month";
  onExploreCity: (city: City) => void;
}) {
  // currently support grouping by country (region); month grouping omitted for simplicity
  if (!cities.length) {
    return (
      <section>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-xl font-semibold">Browse Destinations</h2>
            <div className="mt-1 h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          No destinations match your search.
        </div>
      </section>
    );
  }

  if (groupBy === "region") {
    const byCountry = cities.reduce<Record<string, City[]>>((acc, c) => {
      acc[c.country] = acc[c.country] || [];
      acc[c.country].push(c);
      return acc;
    }, {});
    const entries = Object.entries(byCountry).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    return (
      <section>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-xl font-semibold">Browse Destinations</h2>
            <div className="mt-1 h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
          </div>
        </div>
        <div className="space-y-6">
          {entries.map(([country, list]) => (
            <div key={country}>
              <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                <span>{country}</span>
                <span className="text-muted-foreground">({list.length})</span>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {list.slice(0, 8).map((c) => (
                  <Card key={`browse-${c._id}`} className="overflow-hidden">
                    <div className="h-28 w-full bg-muted overflow-hidden">
                      {c.images?.[0] ? (
                        <img
                          src={c.images[0]}
                          alt={c.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ImagePlaceholder seed={c.name} />
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="font-medium leading-tight">{c.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Cost idx: {c.costIndex ?? 50}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // default flat grid
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Browse Destinations</h2>
          <div className="mt-1 h-1 w-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
        </div>
        <div className="text-sm text-muted-foreground">
          {cities.length} result{cities.length === 1 ? "" : "s"}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.slice(0, 12).map((c) => (
          <Card key={`browse-${c._id}`} className="overflow-hidden">
            <div className="h-28 w-full bg-muted overflow-hidden">
              {c.images?.[0] ? (
                <img
                  src={c.images[0]}
                  alt={c.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ImagePlaceholder seed={c.name} />
              )}
            </div>
            <CardContent className="p-3">
              <div className="font-medium leading-tight">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.country}</div>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full"
                onClick={() => onExploreCity(c)}
              >
                Explore
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// NextTripCountdown: days until next upcoming trip
function NextTripCountdown({ trips }: { trips: Trip[] }) {
  const next = useMemo(() => {
    const now = new Date().getTime();
    return [...trips]
      .filter((t) => new Date(t.startDate).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      )[0];
  }, [trips]);

  if (!next) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">No upcoming trips</div>
          <div className="mt-1 text-2xl font-semibold">
            Plan something amazing
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            Your countdown will appear here once you add a future trip.
          </div>
        </CardContent>
      </Card>
    );
  }

  const daysLeft = Math.max(
    0,
    daysBetween(new Date().toISOString(), next.startDate)
  );
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-sm text-muted-foreground">Next trip in</div>
        <div className="mt-1 text-4xl font-semibold">{daysLeft} days</div>
        <div className="mt-2 text-sm">
          {dateFmt(next.startDate)} – {next.title}
        </div>
      </CardContent>
    </Card>
  );
}

// TravelStats: simple aggregates over trips
function TravelStats({ trips }: { trips: Trip[] }) {
  const stats = useMemo(() => {
    const upcoming = trips.filter((t) => t.status === "upcoming").length;
    const ongoing = trips.filter((t) => t.status === "ongoing").length;
    const completed = trips.filter((t) => t.status === "completed").length;
    const totalCities = trips.reduce((acc, t) => acc + t.cities.length, 0);
    const totalDays = trips.reduce(
      (acc, t) => acc + daysBetween(t.startDate, t.endDate),
      0
    );
    return { upcoming, ongoing, completed, totalCities, totalDays };
  }, [trips]);

  const items = [
    {
      key: "upcoming",
      label: "Upcoming",
      value: stats.upcoming,
      color: "from-blue-500 to-indigo-500",
    },
    {
      key: "ongoing",
      label: "Ongoing",
      value: stats.ongoing,
      color: "from-emerald-500 to-green-500",
    },
    {
      key: "completed",
      label: "Completed",
      value: stats.completed,
      color: "from-amber-500 to-orange-500",
    },
    {
      key: "cities",
      label: "Cities",
      value: stats.totalCities,
      color: "from-purple-500 to-fuchsia-500",
    },
    {
      key: "days",
      label: "Days",
      value: stats.totalDays,
      color: "from-cyan-500 to-sky-500",
    },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((it) => (
            <div key={it.key} className="rounded-lg border p-3">
              <div
                className={`h-1 w-10 rounded-full bg-gradient-to-r ${it.color}`}
              />
              <div className="mt-2 text-xs text-muted-foreground">
                {it.label}
              </div>
              <div className="text-xl font-semibold">{it.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// InspirationCarousel: simple horizontal scroll section
function InspirationCarousel({
  items,
  onExploreItem,
}: {
  items: { title: string; desc?: string; img?: string }[];
  onExploreItem?: (title: string, desc?: string) => void;
}) {
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Inspiration Picks</h2>
          <div className="mt-1 h-1 w-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
        </div>
      </div>
      {items.length ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {items.map((it, idx) => (
            <Card key={`insp-${idx}`} className="min-w-[260px] overflow-hidden">
              <div className="h-28 w-full overflow-hidden bg-muted">
                {(() => {
                  const src = it.img || LOCAL_IMAGE_POOL[idx % LOCAL_IMAGE_POOL.length];
                  return src ? (
                  <img
                    src={src}
                    alt={it.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  ) : (
                    <ImagePlaceholder seed={it.title} />
                  );
                })()}
              </div>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">{it.title}</div>
                {it.desc && <div className="mt-1 font-medium">{it.desc}</div>}
                <Button
                  className="mt-3"
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    onExploreItem ? onExploreItem(it.title, it.desc) : null
                  }
                >
                  Explore
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">
          No inspiration to show yet. Create trips or add activities.
        </div>
      )}
    </section>
  );
}

// AllTrips: list all user trips as cards with pagination
function AllTrips({
  trips,
  currentPage,
  totalPages,
  onPageChange,
}: {
  trips: Trip[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (!trips.length) {
    return (
      <section>
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-xl font-semibold">Your Trips</h2>
            <div className="mt-1 h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          No trips yet. Plan your first adventure!
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Your Trips</h2>
          <div className="mt-1 h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
        </div>
        <div className="text-sm text-muted-foreground">
          {trips.length} shown • Page {currentPage} of {totalPages}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trips.map((t) => (
          <Card key={`trip-${t._id}`} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">{t.title}</div>
                <Badge variant="outline">{t.status}</Badge>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {dateFmt(t.startDate)} – {dateFmt(t.endDate)}
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                {t.cities.length} city{t.cities.length === 1 ? "" : "ies"}{" "}
                planned
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    window.location.assign(`/build-itinerary/${t._id}`)
                  }
                >
                  Open
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.location.assign("/itinerary-view")}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={`page-${page}`}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </section>
  );
}

// MOCK DATA FOR FIRST-TIME USERS
const MOCK_CITIES: City[] = [
  {
    _id: "mock-city-paris",
    name: "Paris",
    country: "France",
    costIndex: 75,
    popularityScore: 92,
    coordinates: [48.8566, 2.3522],
  images: [imgCharlotteNoelle],
  },
  {
    _id: "mock-city-kyoto",
    name: "Kyoto",
    country: "Japan",
    costIndex: 65,
    popularityScore: 86,
    coordinates: [35.0116, 135.7681],
  images: [imgTakashiMiyazaki],
  },
  {
    _id: "mock-city-nyc",
    name: "New York City",
    country: "United States",
    costIndex: 85,
    popularityScore: 90,
    coordinates: [40.7128, -74.006],
  images: [imgAndreBenz],
  },
  {
    _id: "mock-city-bali",
    name: "Bali",
    country: "Indonesia",
    costIndex: 45,
    popularityScore: 88,
    coordinates: [-8.4095, 115.1889],
  images: [imgNickSeagrave],
  },
  {
    _id: "mock-city-barcelona",
    name: "Barcelona",
    country: "Spain",
    costIndex: 60,
    popularityScore: 85,
    coordinates: [41.3851, 2.1734],
  images: [imgDavidKohler],
  },
  {
    _id: "mock-city-cape-town",
    name: "Cape Town",
    country: "South Africa",
    costIndex: 50,
    popularityScore: 80,
    coordinates: [-33.9249, 18.4241],
  images: [imgSydSujuaan],
  },
];

const MOCK_TRIPS: Trip[] = [
  {
    _id: "mock-trip-europe",
    title: "European Adventure",
    description: "Exploring the best of Western Europe",
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(), // 4 weeks from now
    status: "upcoming",
    cities: [
      {
        cityId: "mock-city-paris", // Paris
        startDate: new Date(
          Date.now() + 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        order: 0,
      },
      {
        cityId: "mock-city-barcelona", // Barcelona
        startDate: new Date(
          Date.now() + 21 * 24 * 60 * 60 * 1000
        ).toISOString(),
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        order: 1,
      },
    ],
  },
  {
    _id: "mock-trip-asia",
    title: "Asian Experience",
    description: "Discovering the wonders of Asia",
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    status: "upcoming",
    cities: [
      {
        cityId: "mock-city-kyoto", // Kyoto
        startDate: new Date(
          Date.now() + 45 * 24 * 60 * 60 * 1000
        ).toISOString(),
        endDate: new Date(Date.now() + 52 * 24 * 60 * 60 * 1000).toISOString(),
        order: 0,
      },
      {
        cityId: "mock-city-bali", // Bali
        startDate: new Date(
          Date.now() + 52 * 24 * 60 * 60 * 1000
        ).toISOString(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        order: 1,
      },
    ],
  },
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    _id: "mock-activity-1",
    name: "Eiffel Tower Visit",
    description: "Iconic symbol of Paris with panoramic city views",
    cityId: { _id: "mock-city-paris", name: "Paris", country: "France" },
    category: "Sightseeing",
    cost: 25,
    duration: 3,
  images: [imgCharlotteNoelle],
  },
  {
    _id: "mock-activity-2",
    name: "Kyoto Temple Tour",
    description: "Explore ancient temples and gardens",
    cityId: { _id: "mock-city-kyoto", name: "Kyoto", country: "Japan" },
    category: "Culture",
    cost: 40,
    duration: 5,
  images: [imgTakashiMiyazaki],
  },
  {
    _id: "mock-activity-3",
    name: "Central Park Bicycle Tour",
    description: "Cycle through NYC's famous urban park",
    cityId: {
      _id: "mock-city-nyc",
      name: "New York City",
      country: "United States",
    },
    category: "Adventure",
    cost: 35,
    duration: 2,
  images: [imgAndreBenz],
  },
];

// New ImagePlaceholder component
function ImagePlaceholder({
  seed,
  icon,
  className = "h-full w-full",
}: {
  seed?: string;
  icon?: ReactNode;
  className?: string;
}) {
  // Generate a consistent color based on the seed
  const hue = useMemo(() => {
    if (!seed) return Math.floor(Math.random() * 360);
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash % 360;
  }, [seed]);

  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 80%, 92%), hsl(${
          (hue + 40) % 360
        }, 80%, 96%))`,
      }}
    >
      {icon || <ImageIcon className="h-8 w-8 text-white/50" />}
    </div>
  );
}

// CityExploreDialog component
function CityExploreDialog({
  city,
  isOpen,
  onClose,
}: {
  city: City | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();

  if (!city) return null;

  // Sample activities for the city
  const activities = [
    "Guided City Tour",
    "Museum Visit",
    "Local Food Tasting",
    "Nature Excursion",
    "Evening Entertainment",
    "Bike Tour",
  ];

  const activityIcons = [Camera, Coffee, Utensils, MapPin, Music, Bike];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {city.name}, {city.country}
          </DialogTitle>
          <DialogDescription>
            Explore this amazing destination
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="aspect-video rounded-lg overflow-hidden">
            {city.images?.[0] ? (
              <img
                src={city.images[0]}
                alt={city.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <ImagePlaceholder seed={city.name} />
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">City Highlights</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </span>
                <span>
                  Cost Index: <strong>{city.costIndex ?? 50}</strong>/100
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                </span>
                <span>
                  Popularity: <strong>{city.popularityScore ?? 50}</strong>/100
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </span>
                <span>
                  Best visiting time: <strong>Apr-Oct</strong>
                </span>
              </li>
            </ul>

            <h3 className="text-lg font-medium mt-4 mb-2">Why Visit</h3>
            <p className="text-sm text-muted-foreground">
              {city.name} offers a perfect blend of culture, cuisine, and
              unforgettable experiences. Discover iconic landmarks, enjoy local
              delicacies, and immerse yourself in the unique atmosphere.
            </p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Popular Activities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {activities.slice(0, 3).map((activity, i) => {
              const Icon = activityIcons[i % activityIcons.length];
              return (
                <div
                  key={`act-${i}`}
                  className="rounded-lg border overflow-hidden"
                >
                  <div className="h-24">
                    <ImagePlaceholder
                      seed={`${city.name}-${activity}`}
                      icon={<Icon className="h-8 w-8 text-white/60" />}
                    />
                  </div>
                  <div className="p-2">
                    <div className="text-sm font-medium">{activity}</div>
                    <div className="text-xs text-muted-foreground">
                      From ₹30
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              onClose();
              navigate("/create-trip");
              toast.success(`Start planning your trip to ${city.name}!`);
            }}
          >
            Plan a Trip Here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
