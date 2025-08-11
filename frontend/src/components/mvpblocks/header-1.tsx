import React, { useEffect, useRef, useState, type JSX } from "react";
import { motion, AnimatePresence, useTransform, useScroll } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight, Globe, Map, Compass } from "lucide-react";
import { Link } from "react-router-dom";
// Removed next-themes dependency to avoid build issues; assume light theme
import ThemeToggle from "../ThemeToggle";

// Navigation items (travel platform)
const navItems = [
  {
    name: "Destinations",
    hasDropdown: true,
    icon: <Globe className="h-4 w-4" />,
    dropdownItems: [
      { name: "Popular Cities", to: "/destinations/popular", description: "Explore trending travel destinations" },
      { name: "Hidden Gems", to: "/destinations/hidden-gems", description: "Discover less-traveled but amazing places" },
      { name: "Seasonal Picks", to: "/destinations/seasonal", description: "Best places to visit this season" }
    ]
  },
  {
    name: "Plan Trip",
    hasDropdown: true,
    icon: <Map className="h-4 w-4" />,
    dropdownItems: [
      { name: "Create Itinerary", to: "/plan/create", description: "Build your custom travel plan" },
      { name: "My Trips", to: "/plan/my-trips", description: "View and manage your trips" },
      { name: "Travel Calendar", to: "/plan/calendar", description: "Visualize your journey timeline" }
    ]
  },
  {
    name: "Explore",
    hasDropdown: true,
    icon: <Compass className="h-4 w-4" />,
    dropdownItems: [
      { name: "Activities", to: "/explore/activities", description: "Find things to do at your destination" },
      { name: "Travel Guides", to: "/explore/guides", description: "Expert advice and local insights" },
      { name: "Budget Tools", to: "/explore/budget", description: "Plan and track your travel expenses" }
    ]
  },
  { name: "Community", to: "/community", hasDropdown: false }
];

// Lilac palette for styling
const colors = {
  lilacLight: "#E6E6FA",
  lilacMedium: "#C8A2C8",
  lilacDark: "#9370DB",
  lilacDeep: "#7B68EE",
  accent: "#D8BFD8",
  textLight: "#4A4A6A",
  textDark: "#F0E6FF",
  textMutedLight: "#6C6C8E",
  textMutedDark: "#C4B7DB",
};

export default function Header1(): JSX.Element {
  const isDark = false;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // desktop hover
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null); // mobile toggle
  const headerRef = useRef<HTMLElement | null>(null);

  const { scrollY } = useScroll();
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock background scroll when mobile menu open
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
        backdropFilter: "blur(15px)",
  backgroundColor: isDark ? "rgba(75,61,139,0.8)" : "rgba(230,230,250,0.8)",
  boxShadow: isDark ? "0 8px 32px rgba(115,102,189,0.2)" : "0 8px 32px rgba(200,162,200,0.12)",
  borderBottom: isDark ? "1px solid rgba(230,230,250,0.08)" : "1px solid rgba(200,162,200,0.18)"
      } as React.CSSProperties;
    }
    return {
      backdropFilter: "none",
      backgroundColor: "transparent",
      boxShadow: "none",
      borderBottom: "none"
    } as React.CSSProperties;
  };

  const getTextColors = () => ({
  primary: isDark ? colors.textDark : colors.textLight,
  muted: isDark ? colors.textMutedDark : colors.textMutedLight,
  hover: isDark ? colors.lilacLight : colors.lilacDark
  });

  const textColors = getTextColors();

  return (
    <motion.header
      ref={(el) => { headerRef.current = el; }}
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
  style={{ ...(getMirrorEffect() as React.CSSProperties), opacity: headerOpacity as unknown as number }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Brand */}
          <motion.div
            className="flex items-center space-x-2"
            style={{ y: logoY }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 14 }}>
            <Link to="/" className="flex items-center space-x-2" aria-label="Go to homepage">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{
                  background: isDark
                    ? `linear-gradient(to bottom right, ${colors.lilacMedium}, ${colors.lilacDeep})`
                    : `linear-gradient(to bottom right, ${colors.lilacLight}, ${colors.lilacDark})`,
                  boxShadow: `0 4px 12px rgba(147,112,219,0.35)`
                }}>
                <Globe className="h-6 w-6 text-white" />
              </div>

              <span
                className="bg-clip-text font-bold text-lg sm:text-xl"
                style={{
                  backgroundImage: isDark
                    ? `linear-gradient(to right, ${colors.lilacLight}, ${colors.lilacMedium})`
                    : `linear-gradient(to right, ${colors.lilacDark}, ${colors.lilacDeep})`
                }}>
                GlobeTrotter
              </span>
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <motion.nav
            className="hidden lg:flex lg:items-center lg:space-x-8"
            style={{ y: navItemsY }}
            role="navigation"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}>
                <Link
                  to={item.to ?? "/"}
                  className="flex items-center space-x-2 font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ color: textColors.primary }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = textColors.hover)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = textColors.primary)}>
                  {item.icon}
                  <span className="select-none">{item.name}</span>

                  {item.hasDropdown && (
                    <ChevronDown
                      className="h-4 w-4 transition-transform duration-150"
                      style={{ transform: activeDropdown === item.name ? "rotate(180deg)" : "rotate(0)" }}
                    />
                  )}
                </Link>

                {/* Desktop dropdown */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {activeDropdown === item.name && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-64 overflow-hidden rounded-xl border shadow-xl"
                        style={{
                          backdropFilter: "blur(15px)",
                          backgroundColor: isDark ? "rgba(75,61,139,0.85)" : "rgba(230,230,250,0.95)",
                          boxShadow: isDark ? "0 8px 32px rgba(115,102,189,0.26)" : "0 8px 32px rgba(200,162,200,0.18)",
                          borderColor: isDark ? "rgba(230,230,250,0.08)" : "rgba(200,162,200,0.14)"
                        } as React.CSSProperties}
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18 }}
                      >
            {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
              to={dropdownItem.to ?? "/"}
                            className="block px-4 py-3 transition-all duration-150"
                            style={{ color: textColors.primary }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateX(6px)";
                              e.currentTarget.style.backgroundColor = isDark ? "rgba(147,112,219,0.12)" : "rgba(147,112,219,0.06)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateX(0)";
                              e.currentTarget.style.backgroundColor = "transparent";
                            }}>
                            <div className="font-medium">{dropdownItem.name}</div>
                            {dropdownItem.description && (
                              <div style={{ color: textColors.muted }} className="text-sm mt-0.5">{dropdownItem.description}</div>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </motion.nav>

          {/* Desktop actions */}
          <div className="hidden items-center space-x-4 lg:flex">
            <ThemeToggle />
            <Link
              to="/login"
              className="font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ color: textColors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.color = textColors.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.color = textColors.primary)}>
              Sign In
            </Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 rounded-full px-6 py-2.5 font-medium text-white transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundImage: isDark
                    ? `linear-gradient(to right, ${colors.lilacMedium}, ${colors.lilacDeep})`
                    : `linear-gradient(to right, ${colors.lilacDark}, ${colors.lilacDeep})`,
                  boxShadow: `0 4px 12px rgba(147,112,219,0.3)`
                }}>
                <span className="whitespace-nowrap">Plan Your Trip</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile actions (menu button + small theme toggle placed next to it) */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="hidden sm:block">
              {/* show theme toggle on sm+ as icon near menu */}
              <div className="mr-1">
                <ThemeToggle />
              </div>
            </div>

            <motion.button
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              className="rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={() => setIsMobileMenuOpen((s) => !s)}
              whileTap={{ scale: 0.96 }}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu (collapsible, accessible) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              className="lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}>

              <div
                className="mt-4 rounded-xl border py-4 shadow-xl"
                style={{
                  backdropFilter: "blur(15px)",
                  backgroundColor: isDark ? "rgba(75,61,139,0.9)" : "rgba(230,230,250,0.95)",
                  borderColor: isDark ? "rgba(230,230,250,0.08)" : "rgba(200,162,200,0.14)"
                }}>

                <div className="max-h-[calc(100vh-6.25rem)] overflow-y-auto px-2 sm:px-4">
                  {navItems.map((item) => (
                    <div key={item.name} className="relative">
                      <div className="flex items-center justify-between px-3 py-2">
                        {item.hasDropdown ? (
                          <button
                            className="flex items-center gap-3 font-medium flex-1 text-left"
                            style={{ color: textColors.primary }}
                            aria-expanded={openMobileDropdown === item.name}
                            aria-controls={`mobile-${item.name}-submenu`}
                            onClick={() => setOpenMobileDropdown((prev) => (prev === item.name ? null : item.name))}
                          >
                            <div className="flex items-center gap-2">{item.icon}<span className="select-none">{item.name}</span></div>
                          </button>
                        ) : (
                          <Link
                            to={item.to ?? "/"}
                            className="flex items-center gap-3 font-medium flex-1"
                            style={{ color: textColors.primary }}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="flex items-center gap-2">{item.icon}<span className="select-none">{item.name}</span></div>
                          </Link>
                        )}


                        {item.hasDropdown ? (
                          <button
                            className="p-2 -mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                            aria-expanded={openMobileDropdown === item.name}
                            aria-controls={`mobile-${item.name}-submenu`}
                            onClick={() => setOpenMobileDropdown((prev) => (prev === item.name ? null : item.name))}>
                            <ChevronDown
                              className="h-5 w-5 transition-transform"
                              style={{ transform: openMobileDropdown === item.name ? "rotate(180deg)" : "rotate(0)" }}
                            />
                          </button>
                        ) : null}
                      </div>

                      {/* Mobile collapsible submenu */}
                      <AnimatePresence>
                        {item.hasDropdown && openMobileDropdown === item.name && (
                          <motion.div
                            id={`mobile-${item.name}-submenu`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.16 }}
                            className="pl-6 pr-3 pb-3 space-y-2">
              {item.dropdownItems?.map((d) => (
                              <Link
                                key={d.name}
                to={d.to ?? "/"}
                                className="block rounded-md py-2 px-2 text-sm"
                                style={{ color: textColors.primary }}
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setOpenMobileDropdown(null);
                                }}>
                                <div className="font-medium">{d.name}</div>
                                {d.description && <div style={{ color: textColors.muted }} className="text-xs mt-0.5">{d.description}</div>}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  ))}

                  <div className="mt-3 space-y-3 px-2 sm:px-4">
                    <Link
                      to="/login"
                      className="block w-full rounded-lg py-2.5 text-center font-medium transition-colors duration-150"
                      style={{
                        color: textColors.primary,
                        border: `1px solid ${isDark ? colors.lilacMedium : colors.lilacDark}`
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>

                    <Link
                      to="/register"
                      className="block w-full rounded-lg py-2.5 text-center font-medium text-white transition-all duration-150 hover:shadow-lg"
                      style={{
                        backgroundImage: isDark ? `linear-gradient(to right, ${colors.lilacMedium}, ${colors.lilacDeep})` : `linear-gradient(to right, ${colors.lilacDark}, ${colors.lilacDeep})`,
                        boxShadow: `0 4px 12px rgba(147,112,219,0.28)`
                      }}
                      onClick={() => setIsMobileMenuOpen(false)}>
                      Plan Your Trip
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
}
