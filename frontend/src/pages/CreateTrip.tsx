// "use client";

// import React, { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { useSelector } from "react-redux";
// import type  { RootState } from "../redux/store"

// type TripData = {
//   title: string;
//   description: string;
//   startDate: Date | undefined;
//   endDate: Date | undefined;
// };

// type Suggestion = {
//   name: string;
//   description: string;
//   img: string;
//   lastVisitedStart?: string; // ISO date string
//   lastVisitedEnd?: string; // ISO date string
//   visitsCount?: number;
// };

// type Destination = {
//   name: string;
//   description: string;
//   img: string;
//   avgCost?: number;
//   popularityScore?: number; // 0-100
//   bestSeason?: string;
// };

// const CreateTrip: React.FC = () => {
//     const token = useSelector((state: RootState) => state.auth.accessToken);
//   const [trip, setTrip] = useState<TripData>({
//     title: "",
//     description: "",
//     startDate: undefined,
//     endDate: undefined,
//   });

//   const pastTripSuggestions: Suggestion[] = [
//     {
//       name: "Bali, Indonesia",
//       description: "Beautiful beaches, tropical vibes, and rich culture.",
//       img:
//         "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=60",
//       lastVisitedStart: "2023-07-03",
//       lastVisitedEnd: "2023-07-10",
//       visitsCount: 2,
//     },
//     {
//       name: "Swiss Alps, Switzerland",
//       description: "Breathtaking mountains, skiing, and cozy villages.",
//       img:
//         "https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=1200&auto=format&fit=crop&q=60",
//       lastVisitedStart: "2022-12-20",
//       lastVisitedEnd: "2022-12-27",
//       visitsCount: 1,
//     },
//     {
//       name: "Kyoto, Japan",
//       description: "Historic temples, cherry blossoms, and tea houses.",
//       img:
//         "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1200&auto=format&fit=crop&q=60",
//       lastVisitedStart: "2019-04-05",
//       lastVisitedEnd: "2019-04-12",
//       visitsCount: 1,
//     },
//   ];

//   const popularDestinations: Destination[] = [
//     {
//       name: "Paris, France",
//       description: "Romantic streets, Eiffel Tower, and rich history.",
//       img:
//         "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=60",
//       avgCost: 180,
//       popularityScore: 95,
//       bestSeason: "Apr - Jun",
//     },
//     {
//       name: "Santorini, Greece",
//       description: "Whitewashed buildings, blue domes, and sunsets.",
//       img:
//         "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=60",
//       avgCost: 160,
//       popularityScore: 88,
//       bestSeason: "May - Sep",
//     },
//     {
//       name: "New York City, USA",
//       description: "The city that never sleeps, full of life and lights.",
//       img:
//         "https://images.unsplash.com/photo-1549921296-3a88f40c0d7f?w=1200&auto=format&fit=crop&q=60",
//       avgCost: 200,
//       popularityScore: 93,
//       bestSeason: "Sep - Nov",
//     },
//   ];

//   const formatDateNice = (iso?: string | Date | undefined) => {
//     if (!iso) return "—";
//     try {
//       const d = typeof iso === "string" ? new Date(iso) : iso;
//       return format(d, "MMM d, yyyy");
//     } catch {
//       return String(iso);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setTrip((prev) => ({ ...prev, [name]: value }));
//   };

//   const autofillFromSuggestion = (s: Suggestion) => {
//     setTrip({
//       title: s.name,
//       description: s.description,
//       startDate: s.lastVisitedStart ? new Date(s.lastVisitedStart) : undefined,
//       endDate: s.lastVisitedEnd ? new Date(s.lastVisitedEnd) : undefined,
//     });
//     // Optionally, scroll to top or focus title
//     const el = document.querySelector('input[name="title"]') as HTMLInputElement | null;
//     el?.focus();
//   };

//   const autofillFromDestination = (d: Destination) => {
//     setTrip({
//       title: d.name,
//       description: `${d.description} (Avg cost: $${d.avgCost ?? "—"} / day)`,
//       startDate: undefined,
//       endDate: undefined,
//     });
//     const el = document.querySelector('input[name="title"]') as HTMLInputElement | null;
//     el?.focus();
//   };

//  const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!token) {
//       alert("Please log in to create a trip");
//       return;
//     }

//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/trips`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, 
//         },
//         body: JSON.stringify({
//           title: trip.title,
//           description: trip.description,
//           startDate: trip.startDate,
//           endDate: trip.endDate,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP Error: ${res.status}`);
//       }

//       const data = await res.json();
//       console.log("Trip Created:", data);
//       alert("Trip created successfully!");
//     } catch (err) {
//       console.error("Error creating trip:", err);
//       alert("Something went wrong while creating the trip");
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-10 text-gray-200">
//       {/* Inline styles for fancy button animation & glass effect */}
//       <style>{`
//         /* animated border (infinite) for submit */
//         @keyframes rotateGradient {
//           0% { background-position: 0% 50%;}
//           50% { background-position: 100% 50%;}
//           100% { background-position: 0% 50%;}
//         }

//         .fancy-btn {
//           position: relative;
//           z-index: 0;
//           overflow: visible;
//         }
//         .fancy-btn::before {
//           content: "";
//           position: absolute;
//           inset: -2px;
//           z-index: -1;
//           border-radius: 12px;
//           background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(99,102,241,0.2), rgba(99,102,241,0.06));
//           filter: blur(8px);
//           opacity: 0.9;
//           transition: opacity .3s ease;
//           background-size: 200% 200%;
//           animation: rotateGradient 3s linear infinite;
//         }
//         .fancy-btn:hover::before {
//           opacity: 1;
//           filter: blur(10px);
//         }

//         /* glass input focus ring */
//         .glass-input:focus {
//           outline: none;
//           box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
//           border-color: rgba(99,102,241,0.6);
//         }
//       `}</style>

//       {/* Form Section (glass card) */}
//       <Card className="shadow-xl border border-gray-800 rounded-2xl p-6 bg-[rgba(255,255,255,0.02)] backdrop-blur-md">
//         <CardHeader>
//           <CardTitle className="text-3xl font-bold text-white">Create Your Trip</CardTitle>
//           <p className="text-sm text-gray-400 mt-1">Add basic details and build your itinerary next.</p>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title */}
//             <div>
//               <label className="text-sm text-gray-300 mb-2 block">Trip Title</label>
//               <Input
//                 placeholder="Trip Title"
//                 name="title"
//                 value={trip.title}
//                 onChange={handleChange}
//                 className="glass-input bg-[rgba(255,255,255,0.02)] border border-gray-800 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3"
//                 aria-label="Trip title"
//                 required
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="text-sm text-gray-300 mb-2 block">Description</label>
//               <Textarea
//                 placeholder="Write a short summary of this trip"
//                 name="description"
//                 value={trip.description}
//                 onChange={handleChange}
//                 className="glass-input bg-[rgba(255,255,255,0.02)] border border-gray-800 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3 min-h-[100px]"
//                 aria-label="Trip description"
//                 required
//               />
//             </div>

//             {/* Dates */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <button
//                     type="button"
//                     className={cn(
//                       "w-full text-left px-4 py-3 rounded-xl border border-gray-800 glass-input flex items-center",
//                       !trip.startDate ? "text-gray-400" : "text-gray-100"
//                     )}
//                     aria-label="Pick start date"
//                   >
//                     <CalendarIcon className="mr-3 h-5 w-5 text-gray-300" />
//                     {trip.startDate ? format(trip.startDate, "PPP") : "Pick start date"}
//                   </button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0 bg-gray-900 border border-gray-800 rounded-xl">
//                   <Calendar
//                     mode="single"
//                     selected={trip.startDate}
//                     onSelect={(date) => setTrip((prev) => ({ ...prev, startDate: date }))}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>

//               <Popover>
//                 <PopoverTrigger asChild>
//                   <button
//                     type="button"
//                     className={cn(
//                       "w-full text-left px-4 py-3 rounded-xl border border-gray-800 glass-input flex items-center",
//                       !trip.endDate ? "text-gray-400" : "text-gray-100"
//                     )}
//                     aria-label="Pick end date"
//                   >
//                     <CalendarIcon className="mr-3 h-5 w-5 text-gray-300" />
//                     {trip.endDate ? format(trip.endDate, "PPP") : "Pick end date"}
//                   </button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0 bg-gray-900 border border-gray-800 rounded-xl">
//                   <Calendar
//                     mode="single"
//                     selected={trip.endDate}
//                     onSelect={(date) => setTrip((prev) => ({ ...prev, endDate: date }))}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             {/* Submit */}
//             <div>
//               <Button
//                 type="submit"
//                 className="fancy-btn relative w-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-3 font-semibold"
//                 aria-label="Create trip"
//               >
//                 <span className="relative z-10">Create Trip</span>
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Past Trip Suggestions */}
//       <section>
//         <h3 className="text-xl font-semibold mb-4">Suggestions Based on Your Past Trips</h3>

//         <div className="grid md:grid-cols-3 gap-6">
//           {pastTripSuggestions.map((place, idx) => (
//             <article
//               key={idx}
//               className="relative overflow-hidden rounded-xl shadow-md cursor-pointer group bg-gray-900 border border-gray-800"
//               role="button"
//               tabIndex={0}
//               aria-label={`Suggestion ${place.name}`}
//               onClick={() => autofillFromSuggestion(place)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") autofillFromSuggestion(place);
//               }}
//             >
//               <img
//                 src={place.img}
//                 alt={place.name}
//                 className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 loading="lazy"
//               />

//               {/* overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//               {/* card content */}
//               <div className="p-4">
//                 <h4 className="text-lg font-semibold text-white">{place.name}</h4>
//                 <p className="text-sm text-gray-300 mt-1 line-clamp-2">{place.description}</p>

//                 {/* meta row */}
//                 <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
//                   <div>
//                     <div>Visited:</div>
//                     <div className="text-sm text-gray-200">
//                       {formatDateNice(place.lastVisitedStart)} — {formatDateNice(place.lastVisitedEnd)}
//                     </div>
//                   </div>

//                   <div className="text-right">
//                     <div>Times</div>
//                     <div className="text-sm text-gray-200">{place.visitsCount ?? 0}</div>
//                   </div>
//                 </div>

//                 {/* action row */}
//                 <div className="mt-4 flex gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       autofillFromSuggestion(place);
//                     }}
//                     className="px-3 py-1 rounded-md bg-blue-600/90 text-white text-sm hover:bg-blue-500 transition"
//                   >
//                     Use this
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       // open detail modal or navigate - placeholder
//                       alert(`${place.name}: ${place.description}`);
//                     }}
//                     className="px-3 py-1 rounded-md border border-gray-700 text-gray-200 text-sm hover:bg-white/5 transition"
//                   >
//                     Details
//                   </button>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>

//       {/* Popular Destinations */}
//       <section>
//         <h3 className="text-xl font-semibold mb-4">Popular Destinations</h3>

//         <div className="grid md:grid-cols-3 gap-6">
//           {popularDestinations.map((place, idx) => (
//             <article
//               key={idx}
//               className="relative overflow-hidden rounded-xl shadow-md cursor-pointer group bg-gray-900 border border-gray-800"
//               role="button"
//               tabIndex={0}
//               aria-label={`Destination ${place.name}`}
//               onClick={() => autofillFromDestination(place)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") autofillFromDestination(place);
//               }}
//             >
//               <img
//                 src={place.img}
//                 alt={place.name}
//                 className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                 loading="lazy"
//               />

//               {/* overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

//               <div className="p-4">
//                 <h4 className="text-lg font-semibold text-white">{place.name}</h4>
//                 <p className="text-sm text-gray-300 mt-1 line-clamp-2">{place.description}</p>

//                 {/* meta row */}
//                 <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-400">
//                   <div>
//                     <div className="text-[11px]">Avg/day</div>
//                     <div className="text-sm text-gray-200">${place.avgCost ?? "—"}</div>
//                   </div>
//                   <div>
//                     <div className="text-[11px]">Popularity</div>
//                     <div className="text-sm text-gray-200">{place.popularityScore ?? "—"}</div>
//                   </div>
//                   <div>
//                     <div className="text-[11px]">Best</div>
//                     <div className="text-sm text-gray-200">{place.bestSeason ?? "—"}</div>
//                   </div>
//                 </div>

//                 {/* action row */}
//                 <div className="mt-4 flex gap-2">
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       autofillFromDestination(place);
//                     }}
//                     className="px-3 py-1 rounded-md bg-indigo-600/90 text-white text-sm hover:bg-indigo-500 transition"
//                   >
//                     Add to form
//                   </button>
//                   <button
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       // placeholder action
//                       alert(`Showing highlights for ${place.name}`);
//                     }}
//                     className="px-3 py-1 rounded-md border border-gray-700 text-gray-200 text-sm hover:bg-white/5 transition"
//                   >
//                     Highlights
//                   </button>
//                 </div>
//               </div>
//             </article>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default CreateTrip;


"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import api from "@/api/axios"; // <-- use centralized axios instance
import { useNavigate } from "react-router-dom";

type TripData = {
  title: string;
  description: string;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
};

type Suggestion = {
  name: string;
  description: string;
  img: string;
  lastVisitedStart?: string; // ISO date string
  lastVisitedEnd?: string; // ISO date string
  visitsCount?: number;
};

type Destination = {
  name: string;
  description: string;
  img: string;
  avgCost?: number;
  popularityScore?: number; // 0-100
  bestSeason?: string;
};

const CreateTrip: React.FC = () => {
  const token = useSelector((state: RootState) => state.auth.accessToken);
  const [trip, setTrip] = useState<TripData>({
    title: "",
    description: "",
    startDate: undefined,
    endDate: undefined,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const pastTripSuggestions: Suggestion[] = [
    {
      name: "Bali, Indonesia",
      description: "Beautiful beaches, tropical vibes, and rich culture.",
      img:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=60",
      lastVisitedStart: "2023-07-03",
      lastVisitedEnd: "2023-07-10",
      visitsCount: 2,
    },
    {
      name: "Swiss Alps, Switzerland",
      description: "Breathtaking mountains, skiing, and cozy villages.",
      img:
        "https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=1200&auto=format&fit=crop&q=60",
      lastVisitedStart: "2022-12-20",
      lastVisitedEnd: "2022-12-27",
      visitsCount: 1,
    },
    {
      name: "Kyoto, Japan",
      description: "Historic temples, cherry blossoms, and tea houses.",
      img:
        "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?w=1200&auto=format&fit=crop&q=60",
      lastVisitedStart: "2019-04-05",
      lastVisitedEnd: "2019-04-12",
      visitsCount: 1,
    },
  ];

  const popularDestinations: Destination[] = [
    {
      name: "Paris, France",
      description: "Romantic streets, Eiffel Tower, and rich history.",
      img:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&auto=format&fit=crop&q=60",
      avgCost: 180,
      popularityScore: 95,
      bestSeason: "Apr - Jun",
    },
    {
      name: "Santorini, Greece",
      description: "Whitewashed buildings, blue domes, and sunsets.",
      img:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3f?w=1200&auto=format&fit=crop&q=60",
      avgCost: 160,
      popularityScore: 88,
      bestSeason: "May - Sep",
    },
    {
      name: "New York City, USA",
      description: "The city that never sleeps, full of life and lights.",
      img:
        "https://images.unsplash.com/photo-1549921296-3a88f40c0d7f?w=1200&auto=format&fit=crop&q=60",
      avgCost: 200,
      popularityScore: 93,
      bestSeason: "Sep - Nov",
    },
  ];

  const formatDateNice = (iso?: string | Date | undefined) => {
    if (!iso) return "—";
    try {
      const d = typeof iso === "string" ? new Date(iso) : iso;
      return format(d, "MMM d, yyyy");
    } catch {
      return String(iso);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrip((prev) => ({ ...prev, [name]: value }));
  };

  const autofillFromSuggestion = (s: Suggestion) => {
    setTrip({
      title: s.name,
      description: s.description,
      startDate: s.lastVisitedStart ? new Date(s.lastVisitedStart) : undefined,
      endDate: s.lastVisitedEnd ? new Date(s.lastVisitedEnd) : undefined,
    });
    const el = document.querySelector('input[name="title"]') as HTMLInputElement | null;
    el?.focus();
  };

  const autofillFromDestination = (d: Destination) => {
    setTrip({
      title: d.name,
      description: `${d.description} (Avg cost: $${d.avgCost ?? "—"} / day)`,
      startDate: undefined,
      endDate: undefined,
    });
    const el = document.querySelector('input[name="title"]') as HTMLInputElement | null;
    el?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in to create a trip");
      return;
    }

    setLoading(true);
    try {
      // Convert dates (if present) to ISO strings to send to backend
      const payload = {
        title: trip.title,
        description: trip.description,
        startDate: trip.startDate ? trip.startDate.toISOString() : null,
        endDate: trip.endDate ? trip.endDate.toISOString() : null,
      };

      const res = await api.post("/trips", payload); // <-- using centralized api instance
      const data = res.data;

      console.log("Trip Created:", data);
      alert("Trip created successfully!");
      navigate(`/trips/${data.id}`); // Redirect to the newly created trip page
      // Optionally clear the form or redirect to trip page
      setTrip({ title: "", description: "", startDate: undefined, endDate: undefined });
    } catch (err: any) {
      console.error("Error creating trip:", err);
      // show a helpful message if axios gives a response
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong while creating the trip";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 text-gray-200">
      <style>{`
        @keyframes rotateGradient {
          0% { background-position: 0% 50%;}
          50% { background-position: 100% 50%;}
          100% { background-position: 0% 50%;}
        }
        .fancy-btn {
          position: relative;
          z-index: 0;
          overflow: visible;
        }
        .fancy-btn::before {
          content: "";
          position: absolute;
          inset: -2px;
          z-index: -1;
          border-radius: 12px;
          background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(99,102,241,0.2), rgba(99,102,241,0.06));
          filter: blur(8px);
          opacity: 0.9;
          transition: opacity .3s ease;
          background-size: 200% 200%;
          animation: rotateGradient 3s linear infinite;
        }
        .fancy-btn:hover::before {
          opacity: 1;
          filter: blur(10px);
        }
        .glass-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.6);
        }
      `}</style>

      <Card className="shadow-xl border border-gray-800 rounded-2xl p-6 bg-[rgba(255,255,255,0.02)] backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white">Create Your Trip</CardTitle>
          <p className="text-sm text-gray-400 mt-1">Add basic details and build your itinerary next.</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Trip Title</label>
              <Input
                placeholder="Trip Title"
                name="title"
                value={trip.title}
                onChange={handleChange}
                className="glass-input bg-[rgba(255,255,255,0.02)] border border-gray-800 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3"
                aria-label="Trip title"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Description</label>
              <Textarea
                placeholder="Write a short summary of this trip"
                name="description"
                value={trip.description}
                onChange={handleChange}
                className="glass-input bg-[rgba(255,255,255,0.02)] border border-gray-800 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3 min-h-[100px]"
                aria-label="Trip description"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl border border-gray-800 glass-input flex items-center",
                      !trip.startDate ? "text-gray-400" : "text-gray-100"
                    )}
                    aria-label="Pick start date"
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-300" />
                    {trip.startDate ? format(trip.startDate, "PPP") : "Pick start date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-900 border border-gray-800 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={trip.startDate}
                    onSelect={(date) => setTrip((prev) => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl border border-gray-800 glass-input flex items-center",
                      !trip.endDate ? "text-gray-400" : "text-gray-100"
                    )}
                    aria-label="Pick end date"
                  >
                    <CalendarIcon className="mr-3 h-5 w-5 text-gray-300" />
                    {trip.endDate ? format(trip.endDate, "PPP") : "Pick end date"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-900 border border-gray-800 rounded-xl">
                  <Calendar
                    mode="single"
                    selected={trip.endDate}
                    onSelect={(date) => setTrip((prev) => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className="fancy-btn relative w-full rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white py-3 font-semibold"
                aria-label="Create trip"
              >
                <span className="relative z-10">{loading ? "Creating..." : "Create Trip"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <section>
        <h3 className="text-xl font-semibold mb-4">Suggestions Based on Your Past Trips</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {pastTripSuggestions.map((place, idx) => (
            <article
              key={idx}
              className="relative overflow-hidden rounded-xl shadow-md cursor-pointer group bg-gray-900 border border-gray-800"
              role="button"
              tabIndex={0}
              aria-label={`Suggestion ${place.name}`}
              onClick={() => autofillFromSuggestion(place)}
              onKeyDown={(e) => {
                if (e.key === "Enter") autofillFromSuggestion(place);
              }}
            >
              <img
                src={place.img}
                alt={place.name}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white">{place.name}</h4>
                <p className="text-sm text-gray-300 mt-1 line-clamp-2">{place.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <div>
                    <div>Visited:</div>
                    <div className="text-sm text-gray-200">
                      {formatDateNice(place.lastVisitedStart)} — {formatDateNice(place.lastVisitedEnd)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div>Times</div>
                    <div className="text-sm text-gray-200">{place.visitsCount ?? 0}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      autofillFromSuggestion(place);
                    }}
                    className="px-3 py-1 rounded-md bg-blue-600/90 text-white text-sm hover:bg-blue-500 transition"
                  >
                    Use this
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`${place.name}: ${place.description}`);
                    }}
                    className="px-3 py-1 rounded-md border border-gray-700 text-gray-200 text-sm hover:bg-white/5 transition"
                  >
                    Details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Popular Destinations</h3>

        <div className="grid md:grid-cols-3 gap-6">
          {popularDestinations.map((place, idx) => (
            <article
              key={idx}
              className="relative overflow-hidden rounded-xl shadow-md cursor-pointer group bg-gray-900 border border-gray-800"
              role="button"
              tabIndex={0}
              aria-label={`Destination ${place.name}`}
              onClick={() => autofillFromDestination(place)}
              onKeyDown={(e) => {
                if (e.key === "Enter") autofillFromDestination(place);
              }}
            >
              <img
                src={place.img}
                alt={place.name}
                className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-4">
                <h4 className="text-lg font-semibold text-white">{place.name}</h4>
                <p className="text-sm text-gray-300 mt-1 line-clamp-2">{place.description}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-400">
                  <div>
                    <div className="text-[11px]">Avg/day</div>
                    <div className="text-sm text-gray-200">${place.avgCost ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-[11px]">Popularity</div>
                    <div className="text-sm text-gray-200">{place.popularityScore ?? "—"}</div>
                  </div>
                  <div>
                    <div className="text-[11px]">Best</div>
                    <div className="text-sm text-gray-200">{place.bestSeason ?? "—"}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      autofillFromDestination(place);
                    }}
                    className="px-3 py-1 rounded-md bg-indigo-600/90 text-white text-sm hover:bg-indigo-500 transition"
                  >
                    Add to form
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Showing highlights for ${place.name}`);
                    }}
                    className="px-3 py-1 rounded-md border border-gray-700 text-gray-200 text-sm hover:bg-white/5 transition"
                  >
                    Highlights
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CreateTrip;

