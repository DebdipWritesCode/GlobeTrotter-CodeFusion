import React from "react";

interface ProfileHeaderProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    city?: string;
    country?: string;
  } | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="flex items-center gap-6 mb-8 p-6 bg-white rounded-xl shadow-lg">
      <img
        src="https://via.placeholder.com/120"
        alt="User Avatar"
        className="w-28 h-28 rounded-full border-4 border-indigo-500 object-cover"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-gray-500">{user?.email}</p>
        <p className="text-gray-500">
          {user?.city}, {user?.country}
        </p>
        <button className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
