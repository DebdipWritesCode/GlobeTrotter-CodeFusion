import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { Menu, ChevronDown, Settings, User as UserIcon, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import { clearAccessToken } from "@/slices/authSlice";
import api from "@/api/axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const userName = useSelector((state: RootState) => state.auth.name);
  const userEmail = useSelector((state: RootState) => state.auth.email);

  const getInitials = (name: string | null) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

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
    <nav
      className="sticky top-0 z-50 w-full border-b border-purple-100 dark:border-purple-800
      bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg shadow-md transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            Munshiji
          </span>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/trips" className="nav-link">
              My Trips
            </Link>
            <Link to="/search" className="nav-link">
              Search Cities
            </Link>
            <Link to="/community" className="nav-link">
              Community
            </Link>
            <Link to="/calendar" className="nav-link">
              Calendar
            </Link>
          </div>
        </div>

        {/* Right: Theme toggle & User */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {userName ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 p-1 rounded-md hover:bg-purple-100 dark:hover:bg-purple-800 transition"
                onClick={() => setUserMenuOpen((prev) => !prev)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <ChevronDown className="w-4 h-4 text-purple-900 dark:text-purple-100" />
              </button>

              {userMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg
                    bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-100 dark:border-purple-700
                    overflow-hidden animate-fadeIn"
                >
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <UserIcon className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button
                    className="dropdown-item text-red-500"
                    onClick={() => {
                      setUserMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Login
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded bg-purple-100 dark:bg-purple-800 hover:bg-purple-200 dark:hover:bg-purple-700"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
          >
            <Menu size={28} className="text-purple-900 dark:text-purple-100" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-purple-100 dark:border-purple-700 px-4 py-2"
        >
          <Link
            to="/dashboard"
            className="block py-2 nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/trips"
            className="block py-2 nav-link"
            onClick={() => setMenuOpen(false)}
          >
            My Trips
          </Link>
          {userName && (
            <>
              <div className="flex items-center gap-3 mt-2">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium truncate">{userName}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
              <button
                className="mt-2 w-full text-left text-red-500 py-2 px-3 hover:bg-red-100 dark:hover:bg-red-800 rounded"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 inline mr-2" /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
