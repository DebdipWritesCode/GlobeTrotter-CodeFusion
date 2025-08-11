import React from "react";
import { useNavigate } from "react-router-dom";

interface Trip {
  _id: string;
  title: string;
  coverPhoto?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface TripsTabProps {
  trips: Trip[];
}

const TripsTab: React.FC<TripsTabProps> = ({ trips }) => {
  const navigate = useNavigate();

  if (!trips.length) {
    return <p className="text-gray-500">No trips found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {trips.map(trip => (
        <div
          key={trip._id}
          className="relative group bg-white/60 dark:bg-gray-900/70 backdrop-blur-lg border border-gray-200 dark:border-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl"
        >
          <div className="relative h-40 w-full">
            <img
              src={trip.coverPhoto || "https://via.placeholder.com/300"}
              alt={trip.title}
              className="h-40 w-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h2 className="text-xl font-bold text-white drop-shadow mb-2">{trip.title}</h2>
              <p className="text-sm text-gray-200 drop-shadow">
                {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{trip.title}</h2>
            {trip.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{trip.description}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </p>
            <button
              className="mt-2 px-4 py-2 bg-gray-900 text-white rounded-lg shadow hover:bg-gray-700 transition font-medium"
              onClick={() => navigate(`/view/${trip._id}`)}
            >
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripsTab;