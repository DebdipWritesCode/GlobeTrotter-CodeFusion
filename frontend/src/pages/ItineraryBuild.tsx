// frontend/src/pages/ItineraryBuild.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  Plus,
  Calendar,
  DollarSign,
  X,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  SortAsc,
  GripVertical,
  Sparkles,
} from "lucide-react";

import api from "@/api/axios";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import Reveal from "@/components/ui/reveal";
import Tilt from "@/components/ui/tilt";
import Typewriter from "@/components/ui/typewriter";
import { SparklesCore } from "@/components/ui/sparkles";

type ActivityOption = {
  _id: string;
  name: string;
};

type ActivityRef = {
  activityId: string;
};

type SectionApi = {
  _id: string;
  tripId: string;
  name: string;
  description: string;
  budget?: number;
  startDate: string;
  endDate: string;
  activities: ActivityRef[];
};

type Section = {
  _id?: string;
  id?: number;
  name: string;
  description: string;
  budget: string;
  startDate: Date | null;
  endDate: Date | null;
  activities: ActivityRef[];
  expanded: boolean;
};

type ActivityChip = {
  id: string;
  name: string;
};

type AISectionResp = {
  name: string;
  description: string;
  activities: { activityId: string }[];
  start_date: string;
  end_date: string;
};
type AIResponse = { sections: AISectionResp[] };

type TripCity = {
  cityId: string | { _id: string; name?: string; country?: string };
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
  cities: TripCity[];
};

const daysBetween = (a: Date, b: Date) => {
  const diff = Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(diff, 1);
};

const DiamondNumber = ({ n }: { n: number }) => {
  return (
    <div className="absolute -left-5 sm:-left-7 top-6 z-20 pointer-events-none">
      <div className="relative">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rotate-45 rounded-[10px] bg-gradient-to-tr from-indigo-500 to-purple-500 ring-2 ring-background dark:ring-background/60 shadow-[0_0_22px_rgba(99,102,241,0.75)]" />
        <div
          className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm sm:text-base drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          style={{ transform: "rotate(-45deg)" }}
        >
          {n}
        </div>
      </div>
    </div>
  );
};

const SortableSection = ({
  id,
  section,
  toggleExpand,
  openModalForEdit,
  handleDeleteSection,
  index,
  getActivityName,
  showHandle,
  isTodayActive,
}: {
  id: string;
  section: Section;
  toggleExpand: (id?: string) => void;
  openModalForEdit: (section: Section) => void;
  handleDeleteSection: (id?: string) => void;
  index: number;
  getActivityName: (activityId: string) => string;
  showHandle?: boolean;
  isTodayActive?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.6 : 1,
      cursor: showHandle ? "grab" : "default",
    }),
    [transform, transition, isDragging, showHandle]
  );

  return (
    <Reveal delayMs={index * 60} className="relative mb-10 pl-10 sm:pl-14">
      <Tilt glare className="rounded-xl">
        <div ref={setNodeRef} style={style} className="group">
          <Card
            className="overflow-visible border-indigo-500/20 hover:border-indigo-400/30 transition-all duration-300 bg-gradient-to-br from-background to-background/60 relative"
          >
            {/* vertical connector line segment */}
            <div className="absolute -left-1.5 top-0 bottom-0 hidden sm:block z-0">
              <div className="w-1 h-full bg-gradient-to-b from-indigo-500/70 via-indigo-400/50 to-transparent rounded-full" />
            </div>

            {/* Number diamond */}
            <DiamondNumber n={index + 1} />

            {/* Header */}
            <div
              className="flex items-center gap-3 p-4 sm:p-5"
              onClick={() => toggleExpand(section._id)}
            >
              {showHandle && (
                <div
                  {...attributes}
                  {...listeners}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Drag to reorder"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-medium text-base sm:text-lg truncate">{section.name}</div>
                  <Badge variant="secondary">
                    <DollarSign className="w-3 h-3 mr-1" />
                    {section.budget || "0"}
                  </Badge>
                  {isTodayActive && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      Today
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  {section.startDate && (
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      {section.startDate.toLocaleString()}
                    </Badge>
                  )}
                  {section.endDate && (
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      {section.endDate.toLocaleString()}
                    </Badge>
                  )}
                  {section.startDate && section.endDate && (
                    <span className="text-xs">
                      • {daysBetween(section.startDate, section.endDate)} days
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModalForEdit(section);
                  }}
                  title="Edit Section"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSection(section._id);
                  }}
                  title="Delete Section"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {section.expanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </div>

            {/* Expanded */}
            {section.expanded && (
              <CardContent className="pt-0 pb-5 text-sm text-muted-foreground">
                <div className="mb-3">{section.description}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {section.activities?.map((ref) => (
                    <span
                      key={ref.activityId}
                      className="bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full text-foreground text-xs sm:text-sm"
                    >
                      {getActivityName(ref.activityId)}
                    </span>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </Tilt>
    </Reveal>
  );
};

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const st = h.scrollTop;
      const sh = h.scrollHeight - h.clientHeight;
      setProgress(sh ? st / sh : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed left-0 right-0 top-0 h-[3px] bg-transparent z-40">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-[width] duration-150"
        style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
      />
    </div>
  );
}

const ItineraryBuild: React.FC = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const tripId = search.get("trip") || "";

  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityOption[]>([]);
  const [mode, setMode] = useState<"ai" | "manual">("manual");
  const [sortMode, setSortMode] = useState<"timeline" | "manual">("manual");

  const [aiName, setAiName] = useState("");
  const [aiDesc, setAiDesc] = useState("");
  const [aiStart, setAiStart] = useState<Date | null>(null);
  const [aiEnd, setAiEnd] = useState<Date | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState<AISectionResp[] | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

  // Dialog state
  const [modalOpen, setModalOpen] = useState(false);
  const [editSection, setEditSection] = useState<Section | null>(null);

  // Form state
  const [sectionName, setSectionName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Chip input state
  const [activityChips, setActivityChips] = useState<ActivityChip[]>([]);
  const [activityInput, setActivityInput] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const suggestRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (!suggestRef.current) return;
      if (!suggestRef.current.contains(e.target as Node)) setShowSuggest(false);
    };
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // Load activities, sections, and trip in parallel
        const [actsRes, sectionsRes, tripRes] = await Promise.all([
          api.get<ActivityOption[]>("/activities"),
          tripId ? api.get<SectionApi[]>(`/sections/trip/${tripId}`) : Promise.resolve({ data: [] as SectionApi[] }),
          tripId ? api.get<Trip>(`/trips/${tripId}`) : Promise.resolve({ data: null as unknown as Trip }),
        ]);
        if (!mounted) return;

        setAllActivities(actsRes.data || []);

        const list: SectionApi[] = sectionsRes.data || [];
        setSections(
          list.map((sec) => ({
            _id: sec._id,
            name: sec.name,
            description: sec.description,
            budget: (sec.budget ?? 0).toString(),
            startDate: sec.startDate ? new Date(sec.startDate) : null,
            endDate: sec.endDate ? new Date(sec.endDate) : null,
            activities: Array.isArray(sec.activities) ? sec.activities : [],
            expanded: false,
          }))
        );

        if (tripRes?.data) {
          setTrip(tripRes.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [tripId]);

  // Auto-fill AI builder inputs from trip info to avoid re-entry
  useEffect(() => {
    if (!trip) return;
    setAiName(trip.title || "");
    setAiDesc(trip.description || "");
    setAiStart(new Date(trip.startDate));
    setAiEnd(new Date(trip.endDate));
  }, [trip]);

  const activityMap = useMemo(() => {
    const m = new Map<string, string>();
    allActivities.forEach((a) => m.set(a._id, a.name));
    return m;
  }, [allActivities]);

  const getActivityName = (id: string) => activityMap.get(id) || "Unknown";

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragEnd = (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex((sec) => (sec._id || sec.id?.toString()) === active.id);
      const newIndex = sections.findIndex((sec) => (sec._id || sec.id?.toString()) === over?.id);
      setSections((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  const displaySections = useMemo(() => {
    const list = [...sections];
    if (sortMode === "timeline") {
      list.sort((a, b) => {
        const ta = a.startDate ? a.startDate.getTime() : 0;
        const tb = b.startDate ? b.startDate.getTime() : 0;
        return ta - tb;
      });
    }
    return list;
  }, [sections, sortMode]);

  const totals = useMemo(() => {
    const totalBudget = sections.reduce((sum, s) => sum + Number(s.budget || 0), 0);
    const totalDays = sections.reduce((sum, s) => {
      if (s.startDate && s.endDate) return sum + daysBetween(s.startDate, s.endDate);
      return sum;
    }, 0);
    const activitiesCount = sections.reduce((sum, s) => sum + (s.activities?.length || 0), 0);
    return { totalBudget, totalDays, activitiesCount };
  }, [sections]);

  const openModalForAdd = () => {
    setEditSection(null);
  // Pre-fill from trip to avoid entering again
  setSectionName(trip?.title ? `${trip.title} - Section` : "New Section");
  setDescription(trip?.description || "");
  setBudget("");
  setStartDate(trip ? new Date(trip.startDate) : null);
  setEndDate(trip ? new Date(trip.endDate) : null);
    setActivityChips([]);
    setActivityInput("");
    setShowSuggest(false);
    setModalOpen(true);
  };

  const openModalForEdit = (section: Section) => {
    setEditSection(section);
    setSectionName(section.name);
    setDescription(section.description);
    setBudget(section.budget);
    setStartDate(section.startDate);
    setEndDate(section.endDate);
    setActivityChips(
      (section.activities || []).map((r) => ({ id: r.activityId, name: getActivityName(r.activityId) }))
    );
    setActivityInput("");
    setShowSuggest(false);
    setModalOpen(true);
  };

  const filteredSuggestions = useMemo(() => {
    const q = activityInput.trim().toLowerCase();
    if (!q) return [];
    return allActivities
      .filter(
        (a) =>
          a.name.toLowerCase().includes(q) &&
          !activityChips.some((chip) => chip.id === a._id)
      )
      .slice(0, 6);
  }, [activityInput, allActivities, activityChips]);

  const addChipFromActivity = (act: ActivityOption) => {
    setActivityChips((prev) => [...prev, { id: act._id, name: act.name }]);
    setActivityInput("");
    setShowSuggest(false);
  };

  const handleActivityInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSuggestions[0]) addChipFromActivity(filteredSuggestions[0]);
    }
    if (e.key === "Backspace" && activityInput === "" && activityChips.length) {
      setActivityChips((prev) => prev.slice(0, -1));
    }
  };

  const handleSaveSection = async () => {
    if (!tripId) {
      alert("No trip selected.");
      return;
    }
    if (!sectionName || !description || !startDate || !endDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const bodyData = {
        tripId,
        name: sectionName,
        description,
        budget: Number(budget || 0),
        startDate,
        endDate,
        activities: activityChips.map((c) => ({ activityId: c.id })),
      };

      let res;
      if (editSection?._id) {
        res = await api.put(`/sections/${editSection._id}`, bodyData);
      } else {
        res = await api.post(`/sections`, bodyData);
      }

      const saved = res.data as SectionApi;
      const savedSection: Section = {
        _id: saved._id,
        name: saved.name,
        description: saved.description,
        budget: (saved.budget ?? 0).toString(),
        startDate: saved.startDate ? new Date(saved.startDate) : null,
        endDate: saved.endDate ? new Date(saved.endDate) : null,
        activities: Array.isArray(saved.activities) ? saved.activities : [],
        expanded: false,
      };

      setSections((prev) => {
        if (editSection?._id) {
          return prev.map((sec) => (sec._id === savedSection._id ? savedSection : sec));
        } else {
          return [...prev, savedSection];
        }
      });

      setModalOpen(false);
    } catch (err) {
      console.error("Error saving section:", err);
    }
  };

  const handleDeleteSection = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this section?")) return;
    try {
      await api.delete(`/sections/${id}`);
      setSections((prev) => prev.filter((sec) => sec._id !== id));
    } catch (err) {
      console.error("Error deleting section:", err);
    }
  };

  const toggleExpand = (id?: string) => {
    setSections((prev) => prev.map((sec) => (sec._id === id ? { ...sec, expanded: !sec.expanded } : sec)));
  };

  const generateAI = async () => {
    if (!aiName || !aiDesc || !aiStart || !aiEnd) {
      alert("Please fill AI form fields");
      return;
    }
    try {
      setAiLoading(true);
      const payload = {
        name: aiName,
        description: aiDesc,
        start_date: aiStart.toISOString(),
        end_date: aiEnd.toISOString(),
      };
      // No /api in code; axios baseURL should include it if your server uses it.
      const res = await api.post<AIResponse>("/sections/create-itinerary-by-ai", payload);
      setAiPreview(res.data?.sections ?? []);
    } catch (e) {
      console.error(e);
      alert("AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const saveAIPreview = async () => {
    if (!tripId) {
      alert("No trip selected.");
      return;
    }
    if (!aiPreview?.length) return;

    try {
      const mapped = aiPreview.map((s) => ({
        tripId,
        name: s.name,
        description: s.description,
        budget: 0,
        startDate: s.start_date,
        endDate: s.end_date,
        activities: (s.activities || []).map((a) => ({ activityId: a.activityId })),
      }));
      await api.post("/sections", mapped);

      // refresh sections
      const sectionsRes = await api.get<SectionApi[]>(`/sections/trip/${tripId}`);
      setSections(
        (sectionsRes.data || []).map((sec) => ({
          _id: sec._id,
          name: sec.name,
          description: sec.description,
          budget: (sec.budget ?? 0).toString(),
          startDate: sec.startDate ? new Date(sec.startDate) : null,
          endDate: sec.endDate ? new Date(sec.endDate) : null,
          activities: Array.isArray(sec.activities) ? sec.activities : [],
          expanded: false,
        }))
      );

      // return to manual view
      setMode("manual");
      setAiPreview(null);
    } catch (e) {
      console.error(e);
      alert("Failed to save AI itinerary");
    }
  };

  if (loading) return <Loading />;

  const now = new Date();

  return (
    <div className="relative min-h-[calc(100vh-5rem)]">
      <ScrollProgressBar />
      <SparklesCore
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        background="transparent"
        particleColor="#6366f1"
        particleDensity={35}
        maxSize={3}
        minSize={1}
        speed={2}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-8">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Build Your Itinerary</h1>
              <div className="mt-2 text-muted-foreground">
                <Typewriter
                  className="text-sm sm:text-base"
                  words={[
                    "Timeline-first planning.",
                    "Drag to refine when needed.",
                    "Type activities to add smart chips.",
                    "Beautifully responsive builder.",
                  ]}
                  typingSpeed={55}
                  deletingSpeed={35}
                  pauseBetweenWords={900}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Sort:</span>
              </div>
              <div className="inline-flex rounded-md border overflow-hidden">
                <Button
                  variant={sortMode === "timeline" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSortMode("timeline")}
                >
                  Timeline
                </Button>
                <Button
                  variant={sortMode === "manual" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setSortMode("manual")}
                >
                  Manual
                </Button>
                <Button
                  variant={mode === "manual" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMode("manual")}
                >
                  Manual
                </Button>
                <Button
                  variant={mode === "ai" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setMode("ai")}
                >
                  <Sparkles className="w-4 h-4 mr-1" /> AI
                </Button>
              </div>

              <div className="ml-auto sm:ml-0">
                <Button onClick={openModalForAdd} size="lg" className="shadow-sm">
                  <Plus className="w-5 h-5 mr-2" /> Add New Section
                </Button>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Quick stats */}
        <Reveal direction="up" delayMs={60} className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Card className="border bg-gradient-to-br from-indigo-50/40 to-transparent dark:from-indigo-950/20">
              <CardContent className="py-3 px-4">
                <div className="text-xs text-muted-foreground">Total budget</div>
                <div className="text-lg sm:text-xl font-semibold">$ {totals.totalBudget.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card className="border bg-gradient-to-br from-emerald-50/40 to-transparent dark:from-emerald-950/20">
              <CardContent className="py-3 px-4">
                <div className="text-xs text-muted-foreground">Total days</div>
                <div className="text-lg sm:text-xl font-semibold">{totals.totalDays}</div>
              </CardContent>
            </Card>
            <Card className="border bg-gradient-to-br from-purple-50/40 to-transparent dark:from-purple-950/20 hidden sm:block">
              <CardContent className="py-3 px-4">
                <div className="text-xs text-muted-foreground">Activities</div>
                <div className="text-lg sm:text-xl font-semibold">{totals.activitiesCount}</div>
              </CardContent>
            </Card>
          </div>
        </Reveal>

        {!tripId && (
          <Reveal className="mt-6">
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="text-sm">
                  No trip selected. Choose a trip from your dashboard to start building an itinerary.
                </div>
                <Button variant="secondary" onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        )}

        {mode === "ai" && (
          <Reveal className="mt-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-lg font-medium">AI Itinerary Builder</div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Input placeholder="Trip focus/name" value={aiName} onChange={(e) => setAiName(e.target.value)} />
                  <Input placeholder="Short description" value={aiDesc} onChange={(e) => setAiDesc(e.target.value)} />
                  <div className="flex items-center gap-2 border border-input rounded-md px-2 py-1.5 dark:bg-input/30">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <DatePicker
                      selected={aiStart}
                      onChange={(date) => setAiStart(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="Pp"
                      placeholderText="Start date/time"
                      className="p-1 outline-none bg-transparent min-w-[140px]"
                    />
                  </div>
                  <div className="flex items-center gap-2 border border-input rounded-md px-2 py-1.5 dark:bg-input/30">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <DatePicker
                      selected={aiEnd}
                      onChange={(date) => setAiEnd(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="Pp"
                      placeholderText="End date/time"
                      className="p-1 outline-none bg-transparent min-w-[140px]"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button onClick={generateAI} disabled={aiLoading}>
                    {aiLoading ? "Generating..." : "Generate with AI"}
                  </Button>
                  {aiPreview?.length ? (
                    <Button variant="secondary" onClick={saveAIPreview}>
                      Save to Trip ({aiPreview.length})
                    </Button>
                  ) : null}
                </div>

                {aiPreview?.length ? (
                  <div className="mt-4 grid gap-3">
                    {aiPreview.map((s, i) => (
                      <Card key={`ai-prev-${i}`} className="border-indigo-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{s.name}</div>
                            <Badge variant="outline">
                              {new Date(s.start_date).toLocaleString()} – {new Date(s.end_date).toLocaleString()}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{s.description}</div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(s.activities || []).map((a, idx) => (
                              <span key={`${a.activityId}-${idx}`} className="text-xs bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                                {getActivityName(a.activityId)}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </Reveal>
        )}

        {/* Timeline list */}
        <div className="relative mt-8 sm:mt-10">
          {/* left rail on larger screens */}
          <div className="hidden sm:block sticky top-[6rem] left-4 float-left mr-4 h-[calc(100vh-10rem)]">
            <div className="w-1 h-full bg-gradient-to-b from-indigo-500/60 via-indigo-400/40 to-transparent rounded-full" />
          </div>

          {displaySections.length === 0 && (
            <Reveal className="ml-2 sm:ml-6">
              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  No sections yet. Click “Add New Section” to get started.
                </CardContent>
              </Card>
            </Reveal>
          )}

          {mode === "manual" && (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext
                items={displaySections.map((sec) => sec._id || sec.id?.toString() || "")}
                strategy={verticalListSortingStrategy}
              >
                <div className="ml-2 sm:ml-6">
                  {displaySections.map((sec, index) => {
                    const isTodayActive =
                      !!sec.startDate &&
                      !!sec.endDate &&
                      now >= sec.startDate &&
                      now <= sec.endDate;
                    return (
                      <SortableSection
                        key={sec._id || sec.id || index}
                        id={sec._id || sec.id?.toString() || index.toString()}
                        section={sec}
                        toggleExpand={toggleExpand}
                        openModalForEdit={openModalForEdit}
                        handleDeleteSection={handleDeleteSection}
                        index={index}
                        getActivityName={getActivityName}
                        showHandle
                        isTodayActive={isTodayActive}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Mobile floating add button */}
        <Button
          onClick={openModalForAdd}
          size="lg"
          className="fixed right-4 bottom-4 sm:hidden shadow-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Section
        </Button>

        {/* Add/Edit Dialog */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editSection ? "Edit Section" : "Add New Section"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Input
                placeholder="Section Name"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 border border-input rounded-md px-2 py-1.5 dark:bg-input/30">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="border-0 focus-visible:ring-0 px-0"
                  />
                </div>

                <div className="flex items-center gap-2 border border-input rounded-md px-2 py-1.5 dark:bg-input/30 flex-wrap">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => {
                      if (date) {
                        const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                        setStartDate(istDate);
                      }
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="Pp"
                    placeholderText="Start"
                    className="p-1 outline-none bg-transparent min-w-[120px]"
                  />
                  <span className="text-muted-foreground">-</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => {
                      if (date) {
                        const istDate = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                        setEndDate(istDate);
                      }
                    }}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="Pp"
                    placeholderText="End"
                    className="p-1 outline-none bg-transparent min-w-[120px]"
                  />
                </div>
              </div>

              {/* Activity chips input (type to search or choose suggestion, then added as chip) */}
              <div className="space-y-2" ref={suggestRef}>
                <div className="relative">
                  <Input
                    placeholder="Type an activity name, press Enter or click a suggestion..."
                    value={activityInput}
                    onChange={(e) => {
                      setActivityInput(e.target.value);
                      setShowSuggest(true);
                    }}
                    onFocus={() => setShowSuggest(true)}
                    onKeyDown={handleActivityInputKeyDown}
                  />
                  {showSuggest && filteredSuggestions.length > 0 && (
                    <div className="absolute z-20 mt-1 w-full rounded-md border bg-background shadow-md overflow-hidden">
                      {filteredSuggestions.map((a) => (
                        <button
                          key={a._id}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
                          onClick={() => addChipFromActivity(a)}
                        >
                          {a.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {activityChips.map((act) => (
                    <span
                      key={act.id}
                      className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 border text-sm"
                    >
                      {act.name}
                      <X
                        className="w-4 h-4 cursor-pointer text-red-500"
                        onClick={() =>
                          setActivityChips((prev) => prev.filter((c) => c.id !== act.id))
                        }
                      />
                    </span>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground">
                  Can’t find the activity? Add it under Admin → Activities, then return here.
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveSection}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ItineraryBuild;