import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { accessToken, role } = useSelector((state: RootState) => state.auth);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
