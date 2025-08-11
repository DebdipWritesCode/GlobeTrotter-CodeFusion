import React, { useState } from "react";
import { Plus, Calendar, DollarSign, X, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Activity {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
  description: string;
  budget: string;
  startDate: Date | null;
  endDate: Date | null;
  activities: Activity[];
  expanded: boolean;
}

const ItineraryBuild: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [sectionName, setSectionName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activityInput, setActivityInput] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [mode, setMode] = useState<"ai" | "manual">("manual");

  const handleAddActivity = () => {
    if (activityInput.trim() === "") return;
    setActivities([...activities, { id: Date.now(), name: activityInput }]);
    setActivityInput("");
  };

  const handleRemoveActivity = (id: number) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const handleAddSection = () => {
    if (!sectionName || !description) return;
    setSections([
      ...sections,
      {
        id: Date.now(),
        name: sectionName,
        description,
        budget,
        startDate,
        endDate,
        activities,
        expanded: false,
      },
    ]);
    setSectionName("");
    setDescription("");
    setBudget("");
    setStartDate(null);
    setEndDate(null);
    setActivities([]);
  };

  const toggleExpand = (id: number) => {
    setSections(sections.map((sec) =>
      sec.id === id ? { ...sec, expanded: !sec.expanded } : sec
    ));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Mode toggle */}
        <div className="sticky top-0 bg-black/90 backdrop-blur-sm p-4 border-b border-gray-800 flex justify-center gap-4 z-10">
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded-lg border ${mode === "manual" ? "border-white" : "border-gray-700"} transition`}
          >
            <Plus className="inline-block w-4 h-4 mr-2" /> Manual
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`px-4 py-2 rounded-lg border ${mode === "ai" ? "border-white" : "border-gray-700"} transition`}
          >
            <Sparkles className="inline-block w-4 h-4 mr-2" /> AI
          </button>
        </div>

        {/* AI Mode */}
        {mode === "ai" && (
          <div className="mt-8 bg-gray-900 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">AI Itinerary Builder</h2>
            <p className="text-gray-400 mb-4">
              This will generate a personalized itinerary based on your preferences.
            </p>
            <button
              onClick={() => alert("AI generation in progress...")}
              className="bg-gray-800 px-5 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Generate Now
            </button>
          </div>
        )}

        {/* Manual Mode */}
        {mode === "manual" && (
          <div className="mt-8 bg-[rgb(253,253,253,0.1)] text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Add New Section</h2>
            <input
              type="text"
              placeholder="Section Name"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-[rgb(253,253,253,0.2)] border border-gray-700"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mb-3 rounded bg-[rgb(253,253,253,0.2)]  border border-gray-700"
              rows={3}
            />
            <div className="flex gap-4 mb-3">
              <div className="flex items-center gap-2 border border-gray-700 rounded px-2 bg-[rgb(253,253,253,0.2)] ">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  placeholder="Budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="p-1 outline-none bg-transparent"
                />
              </div>
              <div className="flex items-center gap-2 border border-gray-700 rounded px-2 bg-[rgb(253,253,253,0.2)] ">
                <Calendar className="w-4 h-4 text-gray-400" />
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start"
                  className="p-1 outline-none bg-transparent text-white"
                />
                <span className="text-gray-400">-</span>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="End"
                  className="p-1 outline-none bg-transparent text-white"
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
                  className="flex-1 p-2 rounded bg-[rgb(253,253,253,0.2)]  border border-gray-700"
                />
                <button
                  onClick={handleAddActivity}
                  className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activities.map((act) => (
                  <span
                    key={act.id}
                    className="bg-gray-700 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {act.name}
                    <X
                      className="w-4 h-4 cursor-pointer text-red-400"
                      onClick={() => handleRemoveActivity(act.id)}
                    />
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddSection}
              className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Save Section
            </button>
          </div>
        )}

        {/* Sections List */}
        {sections.length > 0 && (
          <div className="mt-8 space-y-4">
            {sections.map((sec, index) => (
              <div
                key={sec.id}
                className="relative group bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-transform"
              >
                {/* Number badge */}
                <div className="absolute -left-8 top-4 w-10 h-10 flex items-center justify-center rounded-full bg-purple-600 text-white font-bold text-lg shadow-md">
                  {index + 1}
                </div>

                <div
                  className="flex justify-between items-center p-4 cursor-pointer"
                  onClick={() => toggleExpand(sec.id)}
                >
                  <h3 className="text-lg font-bold">{sec.name}</h3>
                  {sec.expanded ? <ChevronUp /> : <ChevronDown />}
                </div>
                {sec.expanded && (
                  <div className="p-4 border-t border-gray-800">
                    <p className="text-gray-300 mb-2">{sec.description}</p>
                    <p className="text-sm text-gray-400">
                      Budget: ${sec.budget || "N/A"} |{" "}
                      {sec.startDate && sec.endDate
                        ? `${sec.startDate.toLocaleDateString()} - ${sec.endDate.toLocaleDateString()}`
                        : "No dates set"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sec.activities.map((act) => (
                        <span
                          key={act.id}
                          className="bg-gray-700 px-3 py-1 rounded-full text-white"
                        >
                          {act.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryBuild;
