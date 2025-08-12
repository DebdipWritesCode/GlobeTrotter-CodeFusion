// NavbarCombined.tsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import { clearAccessToken } from "@/slices/authSlice";
import type { RootState } from "@/redux/store";
import api from "@/api/axios";
import { toast } from "react-toastify";

// UI Components
import { Button } from "../ui/button";
import ThemeToggle from "../ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Icons
import { 
  Menu, X, ChevronDown, Globe, 
  Settings, User as UserIcon, LogOut
} from "lucide-react";

// Navigation items
const NAV_ITEMS = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "My Trips", path: "/trips" },
  { name: "Community", path: "/community" },
  { name: "Search Cities", path: "/search" },
  { name: "Calendar", path: "/calendar" },
];

import "./header-styles.css";

export default function Navbar() {
  // State management
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Router and Redux
  const location = useLocation();
  const dispatch = useDispatch();
  const { name: userName, email: userEmail } = useSelector((state: RootState) => state.auth);
  
  // Detect if we're on the landing page for special styling
  const isLandingPage = location.pathname === "/";
  
  // Monitor scroll position
  const { scrollY } = useScroll();
  useEffect(() => {
    const unsubscribe = scrollY.onChange(y => setScrolled(y > 20));
    return unsubscribe;
  }, [scrollY]);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch(clearAccessToken());
      toast.success("Logged out successfully");
      setUserMenuOpen(false);
      // Redirect to landing page or refresh if already there
      if (location.pathname === "/") {
        window.location.reload(); // Force refresh to update UI state
      } else {
        window.location.href = "/"; // Redirect to landing page
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  // Get avatar initials from name
  const getInitials = (name: string | null) => {
    if (!name) return "GT";
    return name.split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  // Add this to set data-scroll attribute for parallax opacity
  useEffect(() => {
    const updateScrollAttribute = () => {
      const scrollValue = Math.min(80, Math.floor(window.scrollY / 10) * 10);
      document.documentElement.setAttribute('data-scroll', scrollValue.toString());
    };
    
    window.addEventListener('scroll', updateScrollAttribute);
    updateScrollAttribute(); // Initialize on mount
    
    return () => window.removeEventListener('scroll', updateScrollAttribute);
  }, []);

  // Replace your className strings with the new CSS classes
  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 w-full header-container ${
        scrolled
          ? "header-scrolled"
          : isLandingPage
            ? "header-transparent parallax-aware"
            : "header-default"
      }`}>
        <div className="container mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0">
            <div className={`logo-container ${
              isLandingPage && !scrolled ? "logo-transparent" : "logo-default"
            }`}>
              <Globe className="h-5 w-5" />
            </div>
            <span className={
              isLandingPage && !scrolled ? "logo-text-transparent" : "logo-text-default"
            }>GlobeTrotter</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? "nav-item-active" : ""
                } ${
                  isLandingPage && !scrolled ? "nav-item-transparent" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Link 
              to="/book-a-call"
              className={`btn-outline ${
                isLandingPage && !scrolled ? "btn-outline-transparent" : "btn-outline-light"
              }`}
            >
              Book a Call
            </Link>

            <ThemeToggle />
            
            {/* Auth Section */}
            {userName ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 py-1.5"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <Avatar className="h-7 w-7 border-2 border-muted">
                    <AvatarImage src="" alt={userName} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-56 rounded-md bg-background border shadow-lg py-1">
                    <div className="px-4 py-2 border-b">
                      <p className="font-medium">{userName}</p>
                      <p className="text-xs text-muted-foreground">{userEmail}</p>
                    </div>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}>
                      <UserIcon className="h-4 w-4 mr-2" /> Profile
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-muted"
                      onClick={() => setUserMenuOpen(false)}>
                      <Settings className="h-4 w-4 mr-2" /> Settings
                    </Link>
                    <button 
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-medium px-3 py-1.5 rounded-md ${
                  isLandingPage && !scrolled 
                    ? "text-white hover:bg-white/10" 
                    : "hover:bg-muted"
                }`}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Plan Your Trip
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mobile-menu md:hidden container mx-auto px-4 py-3"
            >
              <div className="py-3">
                <nav className="space-y-1">
                  {NAV_ITEMS.map(item => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === item.path 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                
                <div className="py-3">
                  <Link to="/book-a-call" 
                    className="block px-3 py-2 rounded-md text-sm font-medium text-primary hover:bg-primary/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Book a Call
                  </Link>
                </div>
                
                <div className="py-3">
                  {userName ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-3 py-1.5">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={userName} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{userName}</p>
                          <p className="text-xs text-muted-foreground">{userEmail}</p>
                        </div>
                      </div>
                      
                      <Link to="/profile" 
                        className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <UserIcon className="h-4 w-4 mr-2" /> Profile
                      </Link>
                      <Link to="/settings" 
                        className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-muted"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" /> Settings
                      </Link>
                      <button 
                        className="w-full flex items-center px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" /> Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 px-3">
                      <Link to="/login"
                        className="text-center py-2 border rounded-md hover:bg-muted"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link to="/signup"
                        className="text-center py-2 bg-primary text-primary-foreground rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Plan Your Trip
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Add spacer to prevent content from being hidden under navbar */}
      <div className="header-spacer"></div>
    </>
  );
}
