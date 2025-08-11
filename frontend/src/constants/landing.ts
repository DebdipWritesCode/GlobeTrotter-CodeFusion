import {
  MapPin,
  Calendar,
  Plane,
  Compass,
  Globe,
  Users,
  Camera,
  MessageSquare,
  TrendingUp,
  Bookmark,
  ArrowRight,
  Play,
} from "lucide-react";

interface NavItem {
  name: string;
  to: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; to: string; description?: string }[];
}

export const navItems: NavItem[] = [
  { name: "Home", to: "/" },
  { name: "Trips", to: "/trips" },
  {
    name: "Discover",
    to: "/discover",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Destinations",
        to: "/destinations",
        description: "Explore cities and hidden gems",
      },
      {
        name: "Activities",
        to: "/activities",
        description: "Find things to do anywhere in the world",
      },
      { name: "Community", to: "/community", description: "Get tips from other travelers" },
    ],
  },
  { name: "Calendar", to: "/calendar" },
  { name: "About", to: "/about" },
];

export const heroContent = {
  topSpan: "PLAN. DISCOVER. TRAVEL.",
  h1FirstPart: "Your All-in-One ",
  h1Span: "Travel Planning ",
  h1LastPart: "Companion",
  description:
    "Plan trips, discover activities, manage itineraries, and connect with fellow travelers — all in one platform designed for adventurers and explorers.",
};

export const Icons = {
  mapPin: MapPin,
  calendar: Calendar,
  plane: Plane,
  compass: Compass,
  globe: Globe,
  users: Users,
  camera: Camera,
  messageSquare: MessageSquare,
  trendingUp: TrendingUp,
  bookmark: Bookmark,
  arrowRight: ArrowRight,
  play: Play,
};

export const features = [
  {
    title: "Create Custom Trips",
    description:
      "Easily build trips with start/end dates, destinations, and personalized activity suggestions.",
    icon: Icons.mapPin,
  },
  {
    title: "Smart Itineraries",
    description:
      "Organize your days with detailed itineraries, budgets, and must-visit attractions.",
    icon: Icons.calendar,
  },
  {
    title: "Discover New Destinations",
    description:
      "Search and explore unique places, curated activities, and travel recommendations.",
    icon: Icons.compass,
  },
  {
    title: "Community Insights",
    description:
      "Join a vibrant travel community, share experiences, and get insider tips.",
    icon: Icons.users,
  },
  {
    title: "Visual Trip Memories",
    description:
      "Store and share photos from your trips, creating a visual travel journal.",
    icon: Icons.camera,
  },
  {
    title: "Stay Organized",
    description:
      "Sync your travel plans with a calendar view so you never miss an activity or event.",
    icon: Icons.calendar,
  },
];

export const featuresHeaders = {
  title: "Why Choose Our Travel Planner",
  subtitle:
    "We make trip planning simple, collaborative, and fun — giving you everything you need from the moment you dream up your next adventure to the moment you return.",
};

export const footerData = {
  facebookLink: 'https://facebook.com/travelplanner',
  instaLink: 'https://instagram.com/travelplanner',
  twitterLink: 'https://twitter.com/travelplanner',
  githubLink: 'https://github.com/travelplanner',
  dribbbleLink: 'https://dribbble.com/travelplanner',
  services: {
    tripPlanning: '/trip-planning',
    itinerary: '/itinerary',
    community: '/community',
    calendar: '/calendar',
  },
  about: {
    history: '/our-story',
    team: '/meet-the-team',
    mission: '/our-mission',
    careers: '/careers',
  },
  help: {
    faqs: '/faqs',
    support: '/support',
    livechat: '/live-chat',
  },
  contact: {
    email: 'support@travelplanner.com',
    phone: '+1 555-123-4567',
    address: '123 Adventure St, Wanderlust City, World',
  },
  company: {
    name: 'Travel Planner',
    description:
      'Helping travelers explore the world by making trip planning effortless, collaborative, and inspiring.',
    logo: '/logo.webp',
  },
};
