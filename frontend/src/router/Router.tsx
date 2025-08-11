import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import NotFound from "@/pages/NotFound";
import { Route, Routes } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import CompleteProfile from "@/pages/Auth/CompleteProfile";

import MyProfile from "@/pages/User/MyProfile";
import MyTrips from "@/pages/User/MyTrips";
import CreateTrip from "@/pages/CreateTrip";
import ItineraryBuild from "@/pages/ItineraryBuild";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<VerifyEmail />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/trips" element={<MyTrips />} />
        <Route path="/create-trip" element={<CreateTrip/>} />
        <Route path="/build-itinerary" element={<ItineraryBuild/>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
