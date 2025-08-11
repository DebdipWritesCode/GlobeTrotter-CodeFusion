import React from "react";

interface Trip {
  _id: string;
  title: string;
  coverPhoto?: string;
  startDate: string;
  endDate: string;
}

interface TripsTabProps {
  trips: Trip[];
}

const TripsTab: React.FC<TripsTabProps> = ({ trips }) => {
  if (!trips.length) {
    return <p className="text-gray-500">No trips found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {trips.map(trip => (
        <div key={trip._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={trip.coverPhoto || "https://via.placeholder.com/300"}
            alt={trip.title}
            className="h-40 w-full object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold">{trip.title}</h2>
            <p className="text-sm text-gray-500">
              {new Date(trip.startDate).toLocaleDateString()} -{" "}
              {new Date(trip.endDate).toLocaleDateString()}
            </p>
            <button className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
              View
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TripsTab;
