import {
  PhoneCall,
  BarChart,
  FileText,
  Sparkles,
  Globe,
  Plug,
  Clock,
  Twitter,
  Linkedin,
  Github,
  Facebook,
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
  { name: "Agents", to: "/agents" },
  {
    name: "Products",
    to: "/products",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Analytics",
        to: "/analytics",
        description: "Track your metrics",
      },
      {
        name: "Dashboard",
        to: "/dashboard",
        description: "Manage your data",
      },
      { name: "Reports", to: "/reports", description: "Generate insights" },
    ],
  },
  { name: "Pricing", to: "/pricing" },
  { name: "About", to: "/about" },
];

export const heroContent = {
  topSpan: "NO CODING REQUIRED",
  h1FirstPart: "Stop Losing Customers — Start Converting with ",
  h1Span: "AI-Powered ",
  h1LastPart: "Voice Agents",
  description:
    "QuickVoice combines artificial intelligence with cutting-edge voice technology to help you deploy a human-like AI Voice Agent in 2 Minutes.",
};

export const Icons = {
  phoneCall: PhoneCall,
  barChart: BarChart,
  fileText: FileText,
  sparkles: Sparkles,
  globe: Globe,
  plug: Plug,
  clock: Clock,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  facebook: Facebook,
  arrowRight: ArrowRight,
  play: Play,
  // Add more icons here as needed
};

export const features = [
  {
    title: "Launch in Minutes",
    description:
      "Forget lengthy development cycles. Our intuitive, no-code platform lets you build and deploy a sophisticated AI voice agent instantly.",
    icon: Icons.phoneCall,
  },
  {
    title: "HIPAA Compliant Security",
    description:
      "Built on a foundation of security, meeting stringent HIPAA compliance standards to ensure your sensitive customer data is always protected.",
    icon: Icons.barChart,
  },
  {
    title: "Conversation Analytics",
    description:
      "Every call is a data goldmine. Our built-in CRM automatically syncs every interaction, capturing custom insights that enhance your workflows.",
    icon: Icons.fileText,
  },
  {
    title: "Global Language Support",
    description:
      "Connect with customers worldwide with support for over 100 languages, allowing you to serve customers around the corner or across the globe.",
    icon: Icons.globe,
  },
  {
    title: "24/7 Availability",
    description:
      "Your customers get instant responses any time of day or night, ensuring you never miss a potential conversion opportunity.",
    icon: Icons.clock,
  },
  {
    title: "Seamless Integration",
    description:
      "Works with the tools you already love. Effortlessly connect to your existing CRM and telephony systems to streamline operations.",
    icon: Icons.plug,
  },
];

export const featuresHeaders = {
  title: "Why QuickVoice is the Smarter Choice",
  subtitle:
    "We&apos;ve engineered QuickVoice to be a seamless, powerful, and secure extension of your brand. Here&apos;s how we deliver unrivaled value.",
};

export const footerData = {
  facebookLink: 'https://facebook.com/mvpblocks',
  instaLink: 'https://instagram.com/mvpblocks',
  twitterLink: 'https://twitter.com/mvpblocks',
  githubLink: 'https://github.com/mvpblocks',
  dribbbleLink: 'https://dribbble.com/mvpblocks',
  services: {
    webdev: '/web-development',
    webdesign: '/web-design',
    marketing: '/marketing',
    googleads: '/google-ads',
  },
  about: {
    history: '/company-history',
    team: '/meet-the-team',
    handbook: '/employee-handbook',
    careers: '/careers',
  },
  help: {
    faqs: '/faqs',
    support: '/support',
    livechat: '/live-chat',
  },
  contact: {
    email: 'info@quickvoice.co',
    phone: '+91 8637373116',
    address: 'Kolkata, West Bengal, India',
  },
  company: {
    name: 'Quick Voice',
    description:
      'Building beautiful and functional web experiences with modern technologies. We help startups and businesses create their digital presence.',
    logo: '/logo.webp',
  },
};