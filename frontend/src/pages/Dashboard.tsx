import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import type { RootState } from "@/redux/store";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, SortAsc, Group, DollarSign } from "lucide-react";
import { SparklesCore } from "@/components/ui/sparkles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Sun, Calendar } from "lucide-react";
import Earth from "@/components/ui/globe";
import Typewriter from "@/components/ui/typewriter";
import Tilt from "@/components/ui/tilt";
import confetti from "canvas-confetti";
import Reveal from "@/components/ui/reveal";
import heroImg from "@/assets/images/chris-holgersson-iQKoSI25Lws-unsplash.jpg";

type City = {
  _id: string;
  name: string;
  country: string;
  costIndex?: number;
  popularityScore?: number;
  images?: string[];
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

const dateFmt = (d: string | Date) => {
  const dt = new Date(d);
  return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const daysBetween = (a: string, b: string) => {
  const diff = Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading: authLoading, name } = useSelector((s: RootState) => s.auth);

  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<City[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popularity" | "cost" | "az">("popularity");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<"none" | "region" | "month">("region");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [citiesRes, tripsRes] = await Promise.all([
          api.get<City[]>("/api/cities"),
          api.get<Trip[]>("/api/trips/user"),
        ]);
        if (!mounted) return;
        setCities(citiesRes.data || []);
        // sort trips by start date desc by default
        const tt = (tripsRes.data || []).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setTrips(tt);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    cities.forEach((c) => set.add(c.country));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [cities]);

  const filteredCities = useMemo(() => {
    let list = [...cities];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
    }
    if (countryFilter !== "all") {
      list = list.filter((c) => c.country === countryFilter);
    }
    switch (sortBy) {
      case "cost":
        list.sort((a, b) => (a.costIndex ?? 0) - (b.costIndex ?? 0));
        break;
      case "az":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
    }
    return list;
  }, [cities, query, countryFilter, sortBy]);

  const welcomeTitle = useMemo(() => {
    const first = name?.split(" ")[0] || "Trotter";
    return `Welcome, ${first}!`;
  }, [name]);

  const estBudgetForTrip = (t: Trip) => {
    // estimate from average city costIndex * days * base
    const days = daysBetween(t.startDate, t.endDate);
    const cityObjs = t.cities.map((c) => (typeof c.cityId === "string" ? undefined : c.cityId)).filter(Boolean) as City[];
    const avgCostIdx = cityObjs.length ? cityObjs.reduce((s, c) => s + (c.costIndex ?? 50), 0) / cityObjs.length : 50;
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
        <SparklesCore className="absolute inset-0 z-0 opacity-30" background="transparent" particleColor="#ffffff" particleDensity={50} maxSize={3} minSize={1} speed={2} />
      </div>

      {/* Budget highlights strip */}
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
  <Select value={sortBy} onValueChange={(v) => setSortBy(v as "popularity" | "cost" | "az")}>
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
        <Select value={countryFilter} onValueChange={(v) => setCountryFilter(v)}>
          <SelectTrigger className="h-11">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {countryOptions.map((c) => (
              <SelectItem key={c} value={c}>{c === "all" ? "All countries" : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
  <Select value={groupBy} onValueChange={(v) => setGroupBy(v as "none" | "region" | "month")}>
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
      <Tabs defaultValue="discover" className="mt-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="mytrips">My Trips</TabsTrigger>
          <TabsTrigger value="inspiration">Inspiration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="discover" className="space-y-6 mt-4">
          {/* Insert the interactive map */}
          <TravelMap cities={cities} />
          
          {/* Keep existing highlights strip */}
          <Highlights trips={trips} estimate={estBudgetForTrip} />
          
          {/* Keep existing search and controls */}
          
          {/* Add destination categories */}
          <DestinationCategories />
          
          {/* Keep existing regional selections carousel(s) */}
        </TabsContent>
        
        <TabsContent value="mytrips" className="space-y-6 mt-4">
          {/* Trip countdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <NextTripCountdown trips={trips} />
            <TravelStats trips={trips} />
          </div>
          
          {/* Keep existing trips carousel */}
          
          {/* Add trip planning status section */}
          <section>
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-xl font-semibold">Continue Planning</h2>
                <div className="mt-1 h-1 w-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {trips.filter(t => t.status === "upcoming").slice(0, 2).map(t => (
                <Card key={`planning-${t._id}`} className="overflow-hidden">
                  <div className="p-0">
                    <div className="flex h-14 items-center gap-3 bg-muted/50 px-4">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{t.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {dateFmt(t.startDate)} – {dateFmt(t.endDate)}
                        </p>
                      </div>
                      <div className="ml-auto flex gap-2">
                        <Badge variant="outline">{t.status}</Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Planning Progress</span>
                          <span>60%</span>
                        </div>
                        <div className="mt-1 h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="block h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          </span>
                          <span>Cities selected</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="h-4 w-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <span className="block h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          </span>
                          <span>Dates confirmed</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="h-4 w-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <span className="block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          </span>
                          <span>Add activities (3 of 5)</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="h-4 w-4 rounded-full bg-slate-500/20 flex items-center justify-center">
                            <span className="block h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                          </span>
                          <span>Complete budget</span>
                        </div>
                      </div>
                      <Button className="w-full mt-4" onClick={() => navigate(`/build-itinerary?trip=${t._id}`)}>
                        Continue Planning
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
        
        <TabsContent value="inspiration" className="space-y-6 mt-4">
          {/* Travel Inspiration Carousel */}
          <InspirationCarousel />
          
          {/* Travel tips section */}
          <section>
            <div className="flex items-end justify-between mb-3">
              <div>
                <h2 className="text-xl font-semibold">Travel Tips & Insights</h2>
                <div className="mt-1 h-1 w-24 bg-gradient-to-r from-amber-500 to-red-500 rounded-full" />
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/*
                {
                  title: "Pack Smart, Not Hard",
                  desc: "Roll clothes instead of folding to save space and prevent wrinkles.",
                  icon: <Compass className="h-5 w-5" />
                },
                {
                  title: "Currency Exchange",
                  desc: "Use ATMs at your destination for better exchange rates than currency exchanges.",
                  icon: <DollarSign className="h-5 w-5" />
                },
                {
                  title: "Local SIM Cards",
                  desc: "Buy a local SIM card for affordable data and avoid roaming charges.",
                  icon: <Plane className="h-5 w-5" />
                }
              */}
              {filteredCities.slice(0, 4).map((city) => (
                <div key={`seasonal-${city._id}`} className="relative h-48 rounded-lg overflow-hidden group">
                  {city.images?.[0] ? (
                    <img src={city.images[0]} alt={city.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">No image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-medium">{city.name}</h3>
                    <p className="text-sm">{city.country}</p>
                  </div>
                  <div className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white">
                    <Sun className="h-4 w-4" />
                  </div>
                  <Button size="sm" variant="secondary" className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <Button size="lg" className="shadow-lg" onClick={() => navigate("/create-trip")}>+ Plan a Trip</Button>
      </div>
    </div>
  );
};

function Highlights({ trips, estimate }: { trips: Trip[]; estimate: (t: Trip) => number }) {
  const now = new Date();
  const upcoming = trips.filter((t) => new Date(t.endDate) >= now);
  const upcomingCount = upcoming.length;
  const totalDays = upcoming.reduce((acc, t) => acc + daysBetween(t.startDate, t.endDate), 0);
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
          <div className="text-sm text-muted-foreground">Total days planned</div>
          <div className="text-2xl font-semibold">{totalDays}</div>
        </CardContent>
      </Card>
      <Card className="border bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><DollarSign className="h-4 w-4" /> Est. total budget</div>
          <div className="text-2xl font-semibold">$ {totalBudget.toLocaleString()}</div>
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
        <Button variant="outline" onClick={() => void 0}>Open Full Map</Button>
      </div>
      <Reveal className="w-full flex items-center justify-center py-4" direction="up">
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
                  <div className="text-xs text-muted-foreground">{c.country}</div>
                </div>
                <Badge variant="secondary">{Math.round(c.popularityScore ?? 50)}</Badge>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Approx. cost index: <span className="font-medium">{c.costIndex ?? 50}</span>
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

// DestinationCategories: quick-pick categories
function DestinationCategories() {
  const categories = [
    { key: "beach", label: "Beach Escapes", color: "from-sky-500 to-cyan-500" },
    { key: "city", label: "City Breaks", color: "from-indigo-500 to-purple-500" },
    { key: "nature", label: "Nature & Trails", color: "from-emerald-500 to-lime-500" },
    { key: "culture", label: "Culture & History", color: "from-amber-500 to-red-500" },
  ];
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Destination Categories</h2>
          <div className="mt-1 h-1 w-24 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card key={cat.key} className="overflow-hidden">
            <div className={`h-1 w-full bg-gradient-to-r ${cat.color}`} />
            <CardContent className="p-4 flex items-center justify-between">
              <div className="font-medium">{cat.label}</div>
              <Badge variant="outline">Explore</Badge>
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
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
  }, [trips]);

  if (!next) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-sm text-muted-foreground">No upcoming trips</div>
          <div className="mt-1 text-2xl font-semibold">Plan something amazing</div>
          <div className="mt-4 text-sm text-muted-foreground">Your countdown will appear here once you add a future trip.</div>
        </CardContent>
      </Card>
    );
  }

  const daysLeft = Math.max(0, daysBetween(new Date().toISOString(), next.startDate));
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
    const totalDays = trips.reduce((acc, t) => acc + daysBetween(t.startDate, t.endDate), 0);
    return { upcoming, ongoing, completed, totalCities, totalDays };
  }, [trips]);

  const items = [
    { key: "upcoming", label: "Upcoming", value: stats.upcoming, color: "from-blue-500 to-indigo-500" },
    { key: "ongoing", label: "Ongoing", value: stats.ongoing, color: "from-emerald-500 to-green-500" },
    { key: "completed", label: "Completed", value: stats.completed, color: "from-amber-500 to-orange-500" },
    { key: "cities", label: "Cities", value: stats.totalCities, color: "from-purple-500 to-fuchsia-500" },
    { key: "days", label: "Days", value: stats.totalDays, color: "from-cyan-500 to-sky-500" },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((it) => (
            <div key={it.key} className="rounded-lg border p-3">
              <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${it.color}`} />
              <div className="mt-2 text-xs text-muted-foreground">{it.label}</div>
              <div className="text-xl font-semibold">{it.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// InspirationCarousel: simple horizontal scroll section
function InspirationCarousel() {
  const items = [
    { title: "Hidden Gems", desc: "Charming lesser-known cities to explore." },
    { title: "Coastal Vibes", desc: "Sun, sand, and scenic shorelines." },
    { title: "Mountain Getaways", desc: "Fresh air and breathtaking views." },
    { title: "Cultural Capitals", desc: "Museums, galleries, and historic quarters." },
  ];
  return (
    <section>
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="text-xl font-semibold">Inspiration Picks</h2>
          <div className="mt-1 h-1 w-24 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((it, idx) => (
          <Card key={`insp-${idx}`} className="min-w-[240px]">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">{it.title}</div>
              <div className="mt-1 font-medium">{it.desc}</div>
              <Button className="mt-3" size="sm" variant="secondary">Explore</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}