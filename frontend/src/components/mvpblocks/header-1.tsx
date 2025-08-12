// import React, { useEffect, useRef, useState, type JSX } from "react";
// import { motion, AnimatePresence, useTransform, useScroll } from "framer-motion";
// import { Menu, X, ChevronDown, ArrowRight, Globe, Map, Compass } from "lucide-react";
// import { Link } from "react-router-dom";
// import ThemeToggle from "../ThemeToggle";
// import { useTheme } from "../../hooks/useTheme";

// // Navigation items (travel platform)
// const navItems = [
//   {
//     name: "Destinations",
//     hasDropdown: true,
//     icon: <Globe className="h-4 w-4" />,
//     dropdownItems: [
//       { name: "Popular Cities", to: "/destinations/popular", description: "Explore trending travel destinations" },
//       { name: "Hidden Gems", to: "/destinations/hidden-gems", description: "Discover less-traveled but amazing places" },
//       { name: "Seasonal Picks", to: "/destinations/seasonal", description: "Best places to visit this season" }
//     ]
//   },
//   {
//     name: "Plan Trip",
//     hasDropdown: true,
//     icon: <Map className="h-4 w-4" />,
//     dropdownItems: [
//       { name: "Create Itinerary", to: "/plan/create", description: "Build your custom travel plan" },
//       { name: "My Trips", to: "/plan/my-trips", description: "View and manage your trips" },
//       { name: "Travel Calendar", to: "/plan/calendar", description: "Visualize your journey timeline" }
//     ]
//   },
//   {
//     name: "Explore",
//     hasDropdown: true,
//     icon: <Compass className="h-4 w-4" />,
//     dropdownItems: [
//       { name: "Activities", to: "/explore/activities", description: "Find things to do at your destination" },
//       { name: "Travel Guides", to: "/explore/guides", description: "Expert advice and local insights" },
//       { name: "Budget Tools", to: "/explore/budget", description: "Plan and track your travel expenses" }
//     ]
//   },
//   { name: "Community", to: "/community", hasDropdown: false }
// ];

// export default function Header1(): JSX.Element {
//   const { theme } = useTheme();
//   const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
//   const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
//   const headerRef = useRef<HTMLElement | null>(null);

//   const { scrollY } = useScroll();
//   useEffect(() => {
//     const onScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   // lock background scroll when mobile menu open
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isMobileMenuOpen]);

//   const logoY = useTransform(scrollY, [0, 100], [0, -5]);
//   const navItemsY = useTransform(scrollY, [0, 100], [0, 5]);
//   const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.97]);

//   const getMirrorEffect = () => {
//     if (isScrolled) {
//       return {
//         backdropFilter: "blur(20px)",
//         backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.95)",
//         boxShadow: isDark ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "0 8px 32px rgba(0, 0, 0, 0.1)",
//         borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid rgba(0, 0, 0, 0.1)"
//       } as React.CSSProperties;
//     }
//     return {
//       backdropFilter: "none",
//       backgroundColor: "transparent",
//       boxShadow: "none",
//       borderBottom: "none"
//     } as React.CSSProperties;
//   };

//   return (
//     <motion.header
//       ref={headerRef}
//       className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
//       initial={{ y: -100, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       style={{ ...(getMirrorEffect() as React.CSSProperties), opacity: headerOpacity as unknown as number }}
//       transition={{ duration: 0.35, ease: "easeInOut" }}
//       role="banner"
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between lg:h-20">
//           {/* Brand */}
//           <motion.div
//             className="flex items-center space-x-3"
//             style={{ y: logoY }}
//             whileHover={{ scale: 1.02 }}
//             transition={{ type: "spring", stiffness: 400, damping: 14 }}>
//             <Link to="/" className="flex items-center space-x-3" aria-label="Go to homepage">
//               <div
//                 className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg"
//               >
//                 <Globe className="h-6 w-6 text-white" />
//               </div>

//               <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 GlobeTrotter
//               </span>
//             </Link>
//           </motion.div>

//           {/* Desktop nav */}
//           <motion.nav
//             className="hidden lg:flex lg:items-center lg:space-x-8"
//             style={{ y: navItemsY }}
//             role="navigation"
//             aria-label="Main navigation"
//           >
//             {navItems.map((item) => (
//               <div
//                 key={item.name}
//                 className="relative"
//                 onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
//                 onMouseLeave={() => setActiveDropdown(null)}>
//                 <Link
//                   to={item.to ?? "/"}
//                   className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
//                 >
//                   {item.icon}
//                   <span className="select-none">{item.name}</span>

//                   {item.hasDropdown && (
//                     <ChevronDown
//                       className="h-4 w-4 transition-transform duration-200"
//                       style={{ transform: activeDropdown === item.name ? "rotate(180deg)" : "rotate(0)" }}
//                     />
//                   )}
//                 </Link>

//                 {/* Desktop dropdown */}
//                 {item.hasDropdown && (
//                   <AnimatePresence>
//                     {activeDropdown === item.name && (
//                       <motion.div
//                         className="absolute top-full left-0 mt-2 w-72 overflow-hidden rounded-xl border bg-white dark:bg-gray-900 shadow-xl"
//                         initial={{ opacity: 0, y: -10, scale: 0.95 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: -10, scale: 0.95 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         {item.dropdownItems?.map((dropdownItem) => (
//                           <Link
//                             key={dropdownItem.name}
//                             to={dropdownItem.to ?? "/"}
//                             className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
//                           >
//                             <div className="font-medium">{dropdownItem.name}</div>
//                             {dropdownItem.description && (
//                               <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{dropdownItem.description}</div>
//                             )}
//                           </Link>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 )}
//               </div>
//             ))}
//           </motion.nav>

//           {/* Desktop actions */}
//           <div className="hidden items-center space-x-4 lg:flex">
//             <ThemeToggle />
//             <Link
//               to="/login"
//               className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
//             >
//               Sign In
//             </Link>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Link
//                 to="/signup"
//                 className="inline-flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:from-blue-700 hover:to-purple-700"
//               >
//                 <span className="whitespace-nowrap">Plan Your Trip</span>
//                 <ArrowRight className="h-4 w-4" />
//               </Link>
//             </motion.div>
//           </div>

//           {/* Mobile actions */}
//           <div className="flex items-center gap-3 lg:hidden">
//             <ThemeToggle />
//             <motion.button
//               aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
//               aria-expanded={isMobileMenuOpen}
//               className="rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
//               onClick={() => setIsMobileMenuOpen((s) => !s)}
//               whileTap={{ scale: 0.95 }}>
//               {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </motion.button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         <AnimatePresence>
//           {isMobileMenuOpen && (
//             <motion.div
//               key="mobile-menu"
//               className="lg:hidden"
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3, ease: "easeInOut" }}>

//               <div className="mt-4 rounded-xl border bg-white dark:bg-gray-900 py-4 shadow-xl">

//                 <div className="max-h-[calc(100vh-6.25rem)] overflow-y-auto px-4">
//                   {navItems.map((item) => (
//                     <div key={item.name} className="relative">
//                       <div className="flex items-center justify-between py-3">
//                         {item.hasDropdown ? (
//                           <button
//                             className="flex items-center gap-3 font-medium text-gray-700 dark:text-gray-200 flex-1 text-left"
//                             aria-expanded={openMobileDropdown === item.name}
//                             onClick={() => setOpenMobileDropdown(openMobileDropdown === item.name ? null : item.name)}>
//                             {item.icon}
//                             <span>{item.name}</span>
//                             <ChevronDown
//                               className="h-4 w-4 transition-transform duration-200"
//                               style={{ transform: openMobileDropdown === item.name ? "rotate(180deg)" : "rotate(0)" }}
//                             />
//                           </button>
//                         ) : (
//                           <Link
//                             to={item.to ?? "/"}
//                             className="flex items-center gap-3 font-medium text-gray-700 dark:text-gray-200"
//                             onClick={() => setIsMobileMenuOpen(false)}>
//                             {item.icon}
//                             <span>{item.name}</span>
//                           </Link>
//                         )}
//                       </div>

//                       {/* Mobile dropdown */}
//                       {item.hasDropdown && (
//                         <AnimatePresence>
//                           {openMobileDropdown === item.name && (
//                             <motion.div
//                               initial={{ opacity: 0, height: 0 }}
//                               animate={{ opacity: 1, height: "auto" }}
//                               exit={{ opacity: 0, height: 0 }}
//                               transition={{ duration: 0.2 }}
//                               className="overflow-hidden">
//                               {item.dropdownItems?.map((dropdownItem) => (
//                                 <Link
//                                   key={dropdownItem.name}
//                                   to={dropdownItem.to ?? "/"}
//                                   className="block px-6 py-2 text-sm text-gray-600 dark:text-gray-300"
//                                   onClick={() => setIsMobileMenuOpen(false)}>
//                                   <div className="font-medium">{dropdownItem.name}</div>
//                                   {dropdownItem.description && (
//                                     <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{dropdownItem.description}</div>
//                                   )}
//                                 </Link>
//                               ))}
//                             </motion.div>
//                           )}
//                         </AnimatePresence>
//                       )}
//                     </div>
//                   ))}

//                   {/* Mobile actions */}
//                   <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
//                     <div className="flex flex-col space-y-3">
//                       <Link
//                         to="/login"
//                         className="flex items-center justify-center px-4 py-2 font-medium text-gray-700 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
//                         onClick={() => setIsMobileMenuOpen(false)}>
//                         Sign In
//                       </Link>
//                       <Link
//                         to="/signup"
//                         className="flex items-center justify-center space-x-2 px-4 py-2 font-medium text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
//                         onClick={() => setIsMobileMenuOpen(false)}>
//                         <span>Plan Your Trip</span>
//                         <ArrowRight className="h-4 w-4" />
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </motion.header>
//   );
// }

import React, { useEffect, useRef, useState, type JSX } from "react";
import { motion, AnimatePresence, useTransform, useScroll } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight, Globe, Map, Compass, Settings, User as UserIcon, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "../../hooks/useTheme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { clearAccessToken } from "@/slices/authSlice";
import api from "@/api/axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", to: "/dashboard", hasDropdown: false },
  { name: "My Trips", to: "/trips", hasDropdown: false },
  { name: "Search Cities", to: "/search", hasDropdown: false },
  { name: "Community", to: "/community", hasDropdown: false },
  { name: "Calendar", to: "/calendar", hasDropdown: false },
];

export default function Header1(): JSX.Element {
  const { theme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  const dispatch = useDispatch();
  const userName = useSelector((state: RootState) => state.auth.name);
  const userEmail = useSelector((state: RootState) => state.auth.email);

  const { scrollY } = useScroll();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]);

  const logoY = useTransform(scrollY, [0, 100], [0, -5]);
  const navItemsY = useTransform(scrollY, [0, 100], [0, 5]);
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.97]);

  const getMirrorEffect = () => {
    if (isScrolled) {
      return {
        backdropFilter: "blur(20px)",
        backgroundColor: isDark
          ? "rgba(23, 23, 35, 0.92)"
          : "rgba(255, 255, 255, 0.95)",
        boxShadow: isDark
          ? "0 8px 32px rgba(0, 0, 0, 0.3)"
          : "0 8px 32px rgba(0, 0, 0, 0.1)",
        borderBottom: isDark
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid rgba(0, 0, 0, 0.08)",
      } as React.CSSProperties;
    }
    return {
      backdropFilter: "none",
      backgroundColor: "transparent",
      boxShadow: "none",
      borderBottom: "none",
    } as React.CSSProperties;
  };

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
    <motion.header
      ref={headerRef}
      className="sticky top-0 left-0 right-0 z-50 transition-all duration-300"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        ...(getMirrorEffect() as React.CSSProperties),
        opacity: headerOpacity as unknown as number,
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            style={{ y: logoY }}
            whileHover={{ scale: 1.02 }}
          >
            <Link
              to="/"
              className="flex items-center space-x-3"
              aria-label="Go to homepage"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Globe Trotter
              </span>
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <motion.nav
            className="hidden lg:flex lg:items-center lg:space-x-8"
            style={{ y: navItemsY }}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {item.name}
              </Link>
            ))}
          </motion.nav>

          {/* Desktop actions */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Button variant="outline">
              <Link to="/book-a-call">Book a Call</Link>
            </Button>
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

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-purple-100 dark:border-purple-700 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <UserIcon className="w-4 h-4" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button
                        className="flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 transition w-full"
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <motion.button
              onClick={() => setIsMobileMenuOpen((s) => !s)}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="mt-4 rounded-xl border bg-white dark:bg-gray-900 py-4 shadow-xl px-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="block py-2 text-gray-700 dark:text-gray-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                {userName && (
                  <>
                    <div className="flex items-center gap-3 mt-4">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

