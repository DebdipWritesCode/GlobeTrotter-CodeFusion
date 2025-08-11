import React from "react";

interface Trip {
  budget?: number;
}

interface StatsTabProps {
  trips: Trip[];
}

const StatsTab: React.FC<StatsTabProps> = ({ trips }) => {
  const totalBudget = trips.reduce((sum, t) => sum + (t.budget || 0), 0);
  const avgBudget = trips.length ? totalBudget / trips.length : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Trip Statistics</h2>
      <p>Total Trips: {trips.length}</p>
      <p>Total Budget: ₹{totalBudget}</p>
      <p>Average Budget per Trip: ₹{avgBudget.toFixed(2)}</p>
    </div>
  );
};

export default StatsTab;
