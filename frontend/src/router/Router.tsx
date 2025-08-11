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

import ManageUsers from "@/pages/Admin/ManageUsers";
import ManageActivities from "@/pages/Admin/ManageActivities";
import ManageCities from "@/pages/Admin/ManageCities";
import AdminDashboard from "@/pages/Admin/Dashboard";
import Analytics from "@/pages/Admin/Analytics";
import AdminRoute from "./AdminRoute";
import AdminLayout from "@/layouts/AdminLayout";
import Community from "@/pages/Community";
import Calendar from "@/pages/Calendar";
import MyTripsCalendar from "@/pages/Calendar";

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
        <Route path="/build-itinerary/:tripId" element={<ItineraryBuild/>} />
        <Route path="/community" element={<Community/>}/>
        <Route path="/calendar" element={<MyTripsCalendar/>} />
      </Route>

      <Route
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/cities" element={<ManageCities />} />
        <Route path="/admin/activities" element={<ManageActivities />} />
        <Route path="/admin/users" element={<ManageUsers />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
