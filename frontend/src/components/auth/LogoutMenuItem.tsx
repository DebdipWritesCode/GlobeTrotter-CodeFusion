import { useDispatch } from "react-redux";
import { clearAccessToken } from "@/slices/authSlice";
import api from "@/api/axios";
import { toast } from "react-toastify";

const LogoutMenuItem = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(clearAccessToken());
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white text-left"
    >
      Logout
    </button>
  );
};

export default LogoutMenuItem;
