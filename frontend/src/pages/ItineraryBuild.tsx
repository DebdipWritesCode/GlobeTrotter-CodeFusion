// frontend/src/pages/ItineraryBuild.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Sparkles,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
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
import Reveal from "@/components/ui/reveal";
import Tilt from "@/components/ui/tilt";
import Typewriter from "@/components/ui/typewriter";
import { SparklesCore } from "@/components/ui/sparkles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

type ActivityUI = {
  id: string;
  name: string;
};

const TimelineDot = ({ number }: { number: number }) => {
  return (
    <div className="absolute -left-8 top-6 w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-[0_0_14px_rgba(99,102,241,0.65)] flex items-center justify-center text-white font-bold text-base select-none hover:scale-105 transition-transform duration-300">
      {number}
    </div>
  );
};

const CardIcon = ({ index }: { index: number }) => {
  const icons = [
    <Plus key="p" />,
    <Calendar key="c" />,
    <DollarSign key="d" />,
    <Sparkles key="s" />,
    <Edit key="e" />,
    <Trash2 key="t" />,
  ];
  return (
    <div className="text-indigo-400 w-6 h-6 mr-2">
      {icons[index % icons.length]}
    </div>
  );
};

// const SortableSection = ({
//   id,
//   section,
//   toggleExpand,
//   openModalForEdit,
//   handleDeleteSection,
//   index,
//   getActivityName,
// }: {
//   id: string;
//   section: Section;
//   toggleExpand: (id?: string) => void;
//   openModalForEdit: (section: Section) => void;
//   handleDeleteSection: (id?: string) => void;
//   index: number;
//   getActivityName: (activityId: string) => string;
// }) => {
//   const {
//     attributes,
//     listeners,
//     setNodeRef,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({ id });
//   const style = useMemo(
//     () => ({
//       transform: CSS.Transform.toString(transform),
//       transition,
//       opacity: isDragging ? 0.6 : 1,
//       cursor: "grab",
//     }),
//     [transform, transition, isDragging]
//   );

//   return (
//     <Reveal delayMs={index * 60} className="relative mb-10 pl-14">
//       <Tilt glare className="rounded-xl">
//         <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//           <Card className="overflow-hidden border-indigo-500/20 hover:border-indigo-400/30 transition-all duration-300 bg-gradient-to-br from-background to-background/60">
//             <TimelineDot number={index + 1} />
//             <div
//               className="flex justify-between items-center p-5 cursor-pointer select-none hover:bg-muted/40"
//               onClick={() => toggleExpand(section._id)}>
//               <div className="flex items-center font-medium text-base">
//                 <CardIcon index={index} />
//                 {section.name}
//               </div>
//               <div className="flex items-center gap-3">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     openModalForEdit(section);
//                   }}
//                   title="Edit Section">
//                   <Edit className="w-4 h-4" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDeleteSection(section._id);
//                   }}
//                   title="Delete Section">
//                   <Trash2 className="w-4 h-4" />
//                 </Button>
//                 {section.expanded ? (
//                   <ChevronUp className="w-4 h-4" />
//                 ) : (
//                   <ChevronDown className="w-4 h-4" />
//                 )}
//               </div>
//             </div>

//             {section.expanded && (
//               <CardContent className="pt-0 pb-5 text-sm text-muted-foreground">
//                 <div className="mb-3">{section.description}</div>
//                 <div className="mb-2">
//                   <span className="font-mono">Budget:</span>{" "}
//                   <span className="text-indigo-500 font-medium">
//                     ${section.budget || "0"}
//                   </span>{" "}
//                   <span className="mx-2">|</span>
//                   {section.startDate && section.endDate
//                     ? `${section.startDate.toLocaleString()} - ${section.endDate.toLocaleString()}`
//                     : "No dates set"}
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {section.activities?.map((ref) => (
//                     <span
//                       key={ref.activityId}
//                       className="bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full text-foreground">
//                       {getActivityName(ref.activityId)}
//                     </span>
//                   ))}
//                 </div>
//               </CardContent>
//             )}
//           </Card>
//         </div>
//       </Tilt>
//     </Reveal>
//   );
// };

const ItineraryBuild: React.FC = () => {
  const { tripId } = useParams(); // this reads the :id param from the URL
  const navigate = useNavigate();
  console.log("Trip ID from URL:", tripId);

  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [allActivities, setAllActivities] = useState<ActivityOption[]>([]);
  const [mode, setMode] = useState<"ai" | "manual">("manual");

  const [modalOpen, setModalOpen] = useState(false);
  const [editSection, setEditSection] = useState<Section | null>(null);

  const [sectionName, setSectionName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activitiesUI, setActivitiesUI] = useState<ActivityUI[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState<string>("");

  const [activeSection, setActiveSection] = useState<string>("");

  // Add this useEffect to set the first section as active when sections load
  useEffect(() => {
    if (sections.length > 0 && !activeSection) {
      setActiveSection(sections[0]._id || "0");
    }
  }, [sections, activeSection]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const requests: Promise<any>[] = [api.get("/activities")];
        if (tripId) {
          requests.push(api.get(`/sections/trip/${tripId}`));
          console.log(`request is sent to: /sections/trip/${tripId}`);
        }
        const [actsRes, sectionsRes] = await Promise.all(requests);
        if (!mounted) return;
        console.log("Fetched activities:", actsRes.data.length);
        console.log("Fetched sections:", sectionsRes);

        setAllActivities(actsRes.data || []);
        if (sectionsRes) {
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

  const activityMap = useMemo(() => {
    const m = new Map<string, string>();
    allActivities.forEach((a) => m.set(a._id, a.name));
    return m;
  }, [allActivities]);

  const getActivityName = (id: string) => activityMap.get(id) || "Unknown";

  const openModalForAdd = () => {
    setEditSection(null);
    setSectionName("");
    setDescription("");
    setBudget("");
    setStartDate(null);
    setEndDate(null);
    setActivitiesUI([]);
    setSelectedActivityId("");
    setModalOpen(true);
  };

  const openModalForEdit = (section: Section) => {
    setEditSection(section);
    setSectionName(section.name);
    setDescription(section.description);
    setBudget(section.budget);
    setStartDate(section.startDate);
    setEndDate(section.endDate);
    setActivitiesUI(
      (section.activities || []).map((r) => ({
        id: r.activityId,
        name: getActivityName(r.activityId),
      }))
    );
    setSelectedActivityId("");
    setModalOpen(true);
  };

  const handleAddActivity = () => {
    if (!selectedActivityId) return;
    const exists = activitiesUI.some((a) => a.id === selectedActivityId);
    const found = allActivities.find((a) => a._id === selectedActivityId);
    if (!exists && found) {
      setActivitiesUI((prev) => [...prev, { id: found._id, name: found.name }]);
    }
    setSelectedActivityId("");
  };

  const handleRemoveActivity = (id: string) => {
    setActivitiesUI((prev) => prev.filter((a) => a.id !== id));
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
        activities: activitiesUI.map((a) => ({ activityId: a.id })),
      };

      let res;
      if (editSection?._id) {
        res = await api.put(`/sections/${editSection._id}`, bodyData);
      } else {
        res = await api.post(`/ sections`, bodyData);
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
          return prev.map((sec) =>
            sec._id === savedSection._id ? savedSection : sec
          );
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
    if (!window.confirm("Are you sure you want to delete this section?"))
      return;
    try {
      await api.delete(`/sections/${id}`);
      setSections((prev) => prev.filter((sec) => sec._id !== id));
    } catch (err) {
      console.error("Error deleting section:", err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="relative min-h-[calc(100vh-5rem)]">
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
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Build Your Itinerary
              </h1>
              <div className="mt-2 text-muted-foreground">
                <Typewriter
                  className="text-sm sm:text-base"
                  words={[
                    "Navigate between sections.",
                    "Set dates and budget.",
                    "Add activities you love.",
                    "Refine with AI suggestions.",
                  ]}
                  typingSpeed={55}
                  deletingSpeed={35}
                  pauseBetweenWords={900}
                />
              </div>
            </div>

            <div className="shrink-0 flex gap-2">
              <Button
                onClick={async () => {
                  if (!tripId) {
                    alert("No trip selected.");
                    return;
                  }
                  try {
                    setLoading(true); // Start loading

                    // 1️⃣ Fetch trip details
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

                    console.log(
                      "Itinerary created successfully:",
                      itineraryRes.data
                    );

                    // 4️⃣ Refresh page or trigger re-fetch
                    window.location.reload();
                  } catch (error) {
                    console.error("Error generating itinerary:", error);
                  } finally {
                    setLoading(false); // Stop loading
                  }
                }}>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Now
              </Button>
            </div>
          </div>
        </Reveal>

        {!tripId && (
          <Reveal className="mt-6">
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="text-sm">
                  No trip selected. Choose a trip from your dashboard to start
                  building an itinerary.
                </div>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </Reveal>
        )}

        {mode === "ai" && (
          <Reveal className="mt-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-lg font-medium mb-2">
                  AI Itinerary Builder
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  Get a personalized itinerary based on your preferences.
                </div>
              </CardContent>
            </Card>
          </Reveal>
        )}

        {mode === "manual" && (
          <>
            <div className="flex justify-end mt-6">
              <Button onClick={openModalForAdd} size="lg" className="shadow-sm">
                <Plus className="w-5 h-5 mr-2" /> Add New Section
              </Button>
            </div>

            <div className="mt-6">
              {/* Section Navigation Buttons */}
              {sections.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 p-1 bg-muted/30 rounded-lg">
                  {sections.map((section, index) => (
                    <button
                      key={section._id || index}
                      onClick={() =>
                        setActiveSection(section._id || index.toString())
                      }
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        activeSection === (section._id || index.toString())
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}>
                      <CardIcon index={index} />
                      Section {index + 1}
                      <span className="text-xs opacity-75">
                        ({section.activities?.length || 0})
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Active Section Content */}
              {sections.map((section, index) => {
                const isActive =
                  activeSection === (section._id || index.toString());
                if (!isActive) return null;

                return (
                  <Reveal key={section._id || index} className="space-y-6">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-semibold text-foreground mb-2 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            {section.name}
                          </h2>
                          <p className="text-muted-foreground">
                            {section.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModalForEdit(section)}
                            title="Edit Section">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSection(section._id)}
                            title="Delete Section">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Section Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-indigo-500" />
                          <span className="text-muted-foreground">Budget:</span>
                          <span className="font-medium text-indigo-500">
                            ${section.budget || "0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-500" />
                          <span className="text-muted-foreground">
                            Duration:
                          </span>
                          <span className="font-medium">
                            {section.startDate && section.endDate
                              ? `${section.startDate.toLocaleDateString()} - ${section.endDate.toLocaleDateString()}`
                              : "No dates set"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Activities Grid */}
                    <div>
                      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        Activities ({section.activities?.length || 0})
                      </h3>

                      {section.activities && section.activities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {section.activities.map((activityRef, actIndex) => {
                            // Find full activity details from allActivities
                            const activity = allActivities.find(
                              (a) => a._id === activityRef.activityId
                            );

                            return (
                              <Tilt
                                key={activityRef.activityId}
                                glare
                                className="rounded-lg">
                                <Card className="h-full hover:shadow-lg transition-all duration-300 border-indigo-500/20 hover:border-indigo-400/30">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                      <h4 className="font-medium text-foreground line-clamp-2">
                                        {activity?.name ||
                                          getActivityName(
                                            activityRef.activityId
                                          )}
                                      </h4>
                                      <span className="text-xs bg-indigo-500/15 text-indigo-600 px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                                        {activity?.category || "other"}
                                      </span>
                                    </div>

                                    {activity?.description && (
                                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                                        {activity.description}
                                      </p>
                                    )}

                                    <div className="space-y-2 text-xs text-muted-foreground">
                                      {activity?.cost && (
                                        <div className="flex items-center gap-2">
                                          <DollarSign className="w-3 h-3" />
                                          <span>Cost: ${activity.cost}</span>
                                        </div>
                                      )}
                                      {activity?.duration && (
                                        <div className="flex items-center gap-2">
                                          <Calendar className="w-3 h-3" />
                                          <span>
                                            Duration: {activity.duration}h
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </CardContent>
                                </Card>
                              </Tilt>
                            );
                          })}
                        </div>
                      ) : (
                        <Card className="border-dashed border-2 border-muted">
                          <CardContent className="p-8 text-center">
                            <Sparkles className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">
                              No activities added to this section yet.
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={() => openModalForEdit(section)}>
                              Add Activities
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </Reveal>
                );
              })}

              {/* Empty State */}
              {sections.length === 0 && (
                <Card className="border-dashed border-2 border-muted">
                  <CardContent className="p-12 text-center">
                    <Plus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No sections yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your itinerary by adding your first
                      section.
                    </p>
                    <Button onClick={openModalForAdd}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Section
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {editSection ? "Edit Section" : "Add New Section"}
              </DialogTitle>
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
                        const istDate = new Date(
                          date.toLocaleString("en-US", {
                            timeZone: "Asia/Kolkata",
                          })
                        );
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
                        const istDate = new Date(
                          date.toLocaleString("en-US", {
                            timeZone: "Asia/Kolkata",
                          })
                        );
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

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select
                    value={selectedActivityId}
                    onValueChange={setSelectedActivityId}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {allActivities.map((a) => (
                        <SelectItem key={a._id} value={a._id}>
                          {a.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="secondary" onClick={handleAddActivity}>
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activitiesUI.map((act) => (
                    <span
                      key={act.id}
                      className="bg-muted px-3 py-1 rounded-full flex items-center gap-2 border">
                      {act.name}
                      <X
                        className="w-4 h-4 cursor-pointer text-red-500"
                        onClick={() => handleRemoveActivity(act.id)}
                      />
                    </span>
                  ))}
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
