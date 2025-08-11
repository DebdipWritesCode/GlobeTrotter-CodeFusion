import React, { useState, useEffect } from "react";
import Modal from "react-modal";
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

import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import api from "@/api/axios";
import Loading from "@/components/Loading";
import { useParams } from "react-router-dom";

interface Activity {
  id: number;
  name: string;
}

interface Section {
  _id?: string;
  id?: number;
  name: string;
  description: string;
  budget: string;
  startDate: Date | null;
  endDate: Date | null;
  activities: Activity[];
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

const CardIcon = ({ index }: { index: number }) => {
  // example icons for demo, you can customize as needed
  const icons = [
    <Plus />,
    <Calendar />,
    <DollarSign />,
    <Sparkles />,
    <Edit />,
    <Trash2 />,
  ];
  return (
    <div className="text-purple-400 w-6 h-6 mr-2">
      {icons[index % icons.length]}
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
}: {
  id: string;
  section: Section;
  toggleExpand: (id?: string) => void;
  openModalForEdit: (section: Section) => void;
  handleDeleteSection: (id?: string) => void;
  index: number;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

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
        </div>
      )}
    </div>
  );
};

const ItineraryBuild: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);

  const [sections, setSections] = useState<Section[]>([]);
  const [mode, setMode] = useState<"ai" | "manual">("manual");
  const [modalOpen, setModalOpen] = useState(false);
  const [editSection, setEditSection] = useState<Section | null>(null);
  const [sectionName, setSectionName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activityInput, setActivityInput] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);

  const [loading, setLoading] = useState(false); // ⬅ Loading state

  const tripId = useParams<{ tripId: string }>().tripId;

  const onGenerateNowClick = async () => {
    try {
      setLoading(true); // Start loading

      // 1️⃣ Fetch trip details
      const tripRes = await api.get(`/trips/${tripId}`);
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

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await fetch(`${API_BASE}/trip/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch sections");
        const data = await res.json();
        console.log("Fetched sections:", data);
        setSections(
          data.map((sec: any) => ({
            ...sec,
            startDate: sec.startDate ? new Date(sec.startDate) : null,
            endDate: sec.endDate ? new Date(sec.endDate) : null,
            expanded: false,
          }))
        );
      } catch (err) {
        console.error("Error fetching sections:", err);
      }
    };
    fetchSections();
  }, [tripId, token]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex(
        (sec) => (sec._id || sec.id?.toString()) === active.id
      );
      const newIndex = sections.findIndex(
        (sec) => (sec._id || sec.id?.toString()) === over?.id
      );
      setSections((items) => arrayMove(items, oldIndex, newIndex));
      // TODO: Send new order to backend API if needed
    }
  };

  // Modal handlers
  const openModalForAdd = () => {
    setEditSection(null);
    setSectionName("");
    setDescription("");
    setBudget("");
    setStartDate(null);
    setEndDate(null);
    setActivities([]);
    setActivityInput("");
    setModalOpen(true);
  };

  const openModalForEdit = (section: Section) => {
    setEditSection(section);
    setSectionName(section.name);
    setDescription(section.description);
    setBudget(section.budget);
    setStartDate(section.startDate);
    setEndDate(section.endDate);
    setActivities(section.activities || []);
    setActivityInput("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAddActivity = () => {
    if (activityInput.trim() === "") return;
    setActivities([...activities, { id: Date.now(), name: activityInput }]);
    setActivityInput("");
  };

  const handleRemoveActivity = (id: number) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const handleSaveSection = async () => {
    if (!sectionName || !description || !startDate || !endDate) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const bodyData = {
        tripId,
        name: sectionName,
        description,
        budget,
        startDate,
        endDate,
        activities: activities.map((a) => ({ name: a.name })),
      };

      let res;
      if (editSection?._id) {
        res = await fetch(`${API_BASE}/${editSection._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        });
      } else {
        res = await fetch(API_BASE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        });
      }

      if (!res.ok) throw new Error("Failed to save section");

      const savedSection = await res.json();
      savedSection.startDate = new Date(savedSection.startDate);
      savedSection.endDate = new Date(savedSection.endDate);
      savedSection.expanded = false;

      setSections((prev) => {
        if (editSection?._id) {
          return prev.map((sec) =>
            sec._id === savedSection._id ? savedSection : sec
          );
        } else {
          return [...prev, savedSection];
        }
      });

      closeModal();
    } catch (err) {
      console.error("Error saving section:", err);
    }
  };

  const handleDeleteSection = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this section?"))
      return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete section");

      setSections(sections.filter((sec) => sec._id !== id));
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

        {/* AI Mode */}
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

            {/* Timeline line */}
            {/* Timeline line */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}>
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
                </div>
              </SortableContext>
            </DndContext>
          </>
        )}

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

            <div className="flex items-center gap-2 border border-gray-700 rounded px-2 bg-[rgba(253,253,253,0.15)] flex-wrap min-w-[220px]">
              <Calendar className="w-4 h-4 text-gray-400" />

              {/* Start Date (IST) */}
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  if (date) {
                    const istDate = new Date(
                      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
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
                className="p-1 outline-none bg-transparent text-white min-w-[140px]"
              />

              <span className="text-gray-400">-</span>

              {/* End Date (IST) */}
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  if (date) {
                    const istDate = new Date(
                      date.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
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
                className="p-1 outline-none bg-transparent text-white min-w-[140px]"
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
      </div>
    </div>
  );
};

export default ItineraryBuild;
