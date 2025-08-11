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
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import api from "@/api/axios";
import Loading from "@/components/Loading";
import { useParams } from "react-router-dom";

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
}

const API_BASE = "http://localhost:5000/api/sections"; // change to your backend URL

Modal.setAppElement("#root"); // for accessibility

const TimelineDot = ({ number }: { number: number }) => {
  return (
    <div
      className="absolute -left-8 top-6 w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 
      shadow-[0_0_12px_rgba(139,92,246,0.8)] flex items-center justify-center 
      text-white font-bold text-base select-none
      hover:scale-105 transition-transform duration-300">
      {number}
    </div>
  );
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative mb-12 pl-14 rounded-2xl bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900
    border border-purple-700 shadow-lg hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300">
      {/* Numbered Timeline Dot */}
      <TimelineDot number={index + 1} />
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
        className="flex justify-between items-center p-5 cursor-pointer select-none hover:bg-gray-700 rounded-2xl"
        onClick={() => toggleExpand(section._id)}>
        <div className="flex items-center font-semibold text-lg text-white">
          <CardIcon index={index} />
          {section.name}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModalForEdit(section);
            }}
            title="Edit Section"
            className="hover:text-purple-400 transition">
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSection(section._id);
            }}
            title="Delete Section"
            className="hover:text-red-500 transition">
            <Trash2 className="w-5 h-5" />
          </button>
          {section.expanded ? (
            <ChevronUp className="text-white" />
          ) : (
            <ChevronDown className="text-white" />
          )}
        </div>
      </div>
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

      {/* Expanded Content */}
      {section.expanded && (
        <div className="p-5 border-t border-purple-700 text-gray-300 rounded-b-2xl">
          <p className="mb-3">{section.description}</p>
          <p className="text-sm font-mono tracking-wide mb-2">
            Budget:{" "}
            <span className="text-purple-400">${section.budget || "N/A"}</span>{" "}
            |{" "}
            {section.startDate && section.endDate
              ? `${section.startDate.toLocaleDateString()} - ${section.endDate.toLocaleDateString()}`
              : "No dates set"}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {section.activities?.map((act) => (
              <span
                key={act.id}
                className="bg-purple-700 px-4 py-1 rounded-full text-white font-semibold shadow-md">
                {act.name}
              </span>
            ))}
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
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(false); // ⬅ Loading state

  const tripId = useParams<{ tripId: string }>().tripId;

  const onGenerateNowClick = async () => {
    try {
      setLoading(true); // Start loading

      // 1️⃣ Fetch trip details
      console.log("tripId:", tripId);
      const tripRes = await api.get(`/trips/get/${tripId}`);
      const trip = tripRes.data;

      // 2️⃣ Prepare payload
      const payload = {
        name: trip.title,
        description: trip.description,
        start_date: trip.startDate,
        end_date: trip.endDate,
        tripId: tripId,
      };

      // 3️⃣ Send POST request
      const itineraryRes = await api.post(
        "/sections/create-itinerary-by-ai",
        payload
      );

      console.log("Itinerary created successfully:", itineraryRes.data);

      // 4️⃣ Refresh page or trigger re-fetch
      window.location.reload();
    } catch (error) {
      console.error("Error generating itinerary:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };
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
        const res = await fetch(`${API_BASE}/trip/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch sections");
        const data = await res.json();
        console.log("Fetched sections:", data);
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
    setSections(
      sections.map((sec) =>
        sec._id === id ? { ...sec, expanded: !sec.expanded } : sec
      )
    );
  };

  if (loading) {
    return (
      <Loading />
    )
  }
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
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Mode toggle */}
        <div className="sticky top-0 bg-black/90 backdrop-blur-sm p-4 border-b border-gray-800 flex justify-center gap-4 z-10">
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded-lg border ${
              mode === "manual" ? "border-white" : "border-gray-700"
            } transition`}>
            <Plus className="inline-block w-4 h-4 mr-2" /> Manual
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`px-4 py-2 rounded-lg border ${
              mode === "ai" ? "border-white" : "border-gray-700"
            } transition`}>
            <Sparkles className="inline-block w-4 h-4 mr-2" /> AI
          </button>
        </div>
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
          <div className="mt-8 bg-gray-900 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">AI Itinerary Builder</h2>
            <p className="text-gray-400 mb-4">
              This will generate a personalized itinerary based on your
              preferences.
            </p>
            <button
              onClick={onGenerateNowClick}
              className="bg-gray-800 px-5 py-2 rounded-lg hover:bg-gray-700 transition">
              Generate Now
            </button>
          </div>
        )}

        {/* Manual Mode */}
        {mode === "manual" && (
          <>
            <div className="flex justify-end mt-6">
              <button
                onClick={openModalForAdd}
                className="bg-purple-600 px-6 py-3 rounded-full hover:bg-purple-700 inline-flex items-center gap-3 font-semibold tracking-wide shadow-lg">
                <Plus className="w-6 h-6" /> Add New Section
              </button>
            </div>
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

            {/* Timeline line */}
            {/* Timeline line */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}>
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
                items={sections.map(
                  (sec) => sec._id || sec.id?.toString() || ""
                )}
                strategy={verticalListSortingStrategy}>
                <div className="relative mt-10 ml-6">
                  {/* Center glowing vertical line */}
                  <div className="absolute top-0 left-[1.4rem] w-1 bg-gradient-to-b from-purple-500 via-purple-400 to-transparent rounded-full shadow-[0_0_10px_rgba(168,85,247,0.7)]"></div>

                  {sections.map((sec, index) => (
                    <SortableSection
                      key={sec._id || sec.id || index}
                      id={sec._id || sec.id?.toString() || index.toString()}
                      section={sec}
                      toggleExpand={toggleExpand}
                      openModalForEdit={openModalForEdit}
                      handleDeleteSection={handleDeleteSection}
                      index={index}
                    />
                  ))}
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

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          contentLabel="Add/Edit Section"
          className="max-w-xl mx-auto mt-24 bg-gray-900 p-6 rounded-xl shadow-lg outline-none"
          overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50">
          <h2 className="text-xl font-semibold mb-4">
            {editSection ? "Edit Section" : "Add New Section"}
          </h2>
          <input
            type="text"
            placeholder="Section Name"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-[rgb(253,253,253,0.2)] border border-gray-700 text-white"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 mb-3 rounded bg-[rgb(253,253,253,0.2)] border border-gray-700 text-white"
            rows={3}
          />
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex items-center gap-2 border border-gray-700 rounded px-2 bg-[rgba(253,253,253,0.15)] min-w-[120px]">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <input
                type="number"
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="p-1 outline-none bg-transparent text-white w-full"
              />
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

          {/* Activities */}
          <div className="mb-3">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add activity..."
                value={activityInput}
                onChange={(e) => setActivityInput(e.target.value)}
                className="flex-1 p-2 rounded bg-[rgb(253,253,253,0.2)] border border-gray-700 text-white"
              />
              <button
                onClick={handleAddActivity}
                className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activities.map((act) => (
                <span
                  key={act.id}
                  className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2">
                  {act.name}
                  <X
                    className="w-4 h-4 cursor-pointer text-red-400"
                    onClick={() => handleRemoveActivity(act.id)}
                  />
                </span>
              ))}
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

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">
              Cancel
            </button>
            <button
              onClick={handleSaveSection}
              className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700">
              Save
            </button>
          </div>
        </Modal>
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