import React, { useState } from "react";
import {
  Dribbble,
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Globe,
  Calendar,
  Users,
  Compass,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { footerData as data } from "@/constants/landing";

/**
 * Footer for GlobeTrotter
 * - Designed to reflect the product features: Plan New Trip, Itinerary, Calendar, Community
 * - Internal links use <Link> for client navigation
 * - Includes newsletter signup UX (client-side only placeholder)
 * - Expects `footerData` to provide urls and contact info (see comments below)
 */
export default function FooterGlobeTrotter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const year = new Date().getFullYear();

  function handleSubscribe(e) {
    e.preventDefault();
    setError("");
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // placeholder: replace with real API call
    // fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })...
    console.log("Subscribe request (placeholder):", email);
    setSubscribed(true);
  }

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: data.facebookLink },
    { icon: Instagram, label: "Instagram", href: data.instaLink },
    { icon: Twitter, label: "Twitter", href: data.twitterLink },
    { icon: Github, label: "GitHub", href: data.githubLink },
    { icon: Dribbble, label: "Dribbble", href: data.dribbbleLink },
  ];

  return (
    <footer className="bg-secondary dark:bg-secondary/20 mt-16 w-full rounded-t-xl">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
          {/* Brand + short mission + CTAs */}
          <div>
            <div className="flex items-center gap-3">
              <img src={'/logo.svg'} alt="GlobeTrotter logo" className="h-10 w-10 rounded-full" />
              <div>
                <h3 className="text-2xl font-semibold text-primary">{data.company.name}</h3>
                <p className="text-xs text-secondary-foreground/80">{data.company.tagline || 'Empowering Personalized Travel Planning'}</p>
              </div>
            </div>

            <p className="text-foreground/60 mt-6 text-sm leading-relaxed">
              {data.company.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/create-trip" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:opacity-95">
                <Compass className="size-4" />
                Plan New Trip
              </Link>

              <Link to="/trips" className="inline-flex items-center gap-2 rounded-md border border-primary/20 px-3 py-2 text-sm font-medium hover:bg-primary/5">
                <Users className="size-4" />
                My Trips
              </Link>

              <a href={data.publicItineraries || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary-foreground/6">
                <ExternalLink className="size-4" />
                Explore Shared Plans
              </a>
            </div>

            <ul className="mt-8 flex gap-4">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="text-primary hover:text-primary/80 transition">
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-sm">
            <h4 className="text-lg font-medium">Product</h4>
            <ul className="mt-6 space-y-3">
              <li>
                <Link to="/create-trip" className="flex items-center gap-2 text-secondary-foreground/80 hover:text-secondary-foreground">
                  <ArrowRight className="size-4" />
                  Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/build-itinerary/" className="flex items-center gap-2 text-secondary-foreground/80 hover:text-secondary-foreground">
                  <Calendar className="size-4" />
                  Itinerary Builder
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="flex items-center gap-2 text-secondary-foreground/80 hover:text-secondary-foreground">
                  <Calendar className="size-4" />
                  Trip Calendar
                </Link>
              </li>
              <li>
                <Link to="/search" className="flex items-center gap-2 text-secondary-foreground/80 hover:text-secondary-foreground">
                  <Globe className="size-4" />
                  Search Cities & Activities
                </Link>
              </li>
            </ul>
          </div>

          {/* Community & Support */}
          <div className="text-sm">
            <h4 className="text-lg font-medium">Community & Support</h4>
            <ul className="mt-6 space-y-3">
              <li>
                <Link to="/community" className="text-secondary-foreground/80 hover:text-secondary-foreground flex items-center gap-2">
                  <Users className="size-4" />
                  Community
                </Link>
              </li>
              <li>
                <Link to="/book-a-call" className="text-secondary-foreground/80 hover:text-secondary-foreground flex items-center gap-2">
                  <Phone className="size-4" />
                  Book a Call
                </Link>
              </li>
              <li>
                <a href={data.help.support} className="text-secondary-foreground/80 hover:text-secondary-foreground flex items-center gap-2">
                  <Mail className="size-4" />
                  Support Center
                </a>
              </li>
              <li>
                <Link to="/privacy" className="text-secondary-foreground/80 hover:text-secondary-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact + Newsletter */}
          <div className="text-sm">
            <h4 className="text-lg font-medium">Contact & Newsletter</h4>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-primary" />
                <address className="not-italic text-secondary-foreground/80">{data.contact.address}</address>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="size-5 text-primary" />
                <a href={`tel:${data.contact.phone}`} className="text-secondary-foreground/80">{data.contact.phone}</a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="size-5 text-primary" />
                <a href={`mailto:${data.contact.email}`} className="text-secondary-foreground/80">{data.contact.email}</a>
              </div>

              <form onSubmit={handleSubscribe} className="mt-2 flex flex-col items-stretch gap-2">
                <label htmlFor="footer-newsletter" className="sr-only">Subscribe to our newsletter</label>
                <div className="flex gap-2">
                  <input
                    id="footer-newsletter"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    aria-label="Email for newsletter"
                  />
                  <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white">
                    Subscribe
                  </button>
                </div>

                {error && <p className="text-xs text-rose-500">{error}</p>}
                {subscribed && <p className="text-xs text-emerald-500">Thanks — you'll hear from us soon!</p>}
              </form>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-secondary-foreground/70">&copy; {year} {data.company.name}. All rights reserved.</p>

            <div className="flex items-center gap-4 text-sm text-secondary-foreground/70">
              <span>Made with ❤️ · Built for travelers</span>
              <Link to="/about" className="hover:text-secondary-foreground">About</Link>
              <Link to="/terms" className="hover:text-secondary-foreground">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/*
Expected shape for footerData (constants/landing):

export const footerData = {
  company: {
    name: 'GlobeTrotter',
    tagline: 'Empowering Personalized Travel Planning',
    description: 'GlobeTrotter helps you design, budget and share multi-city trips with intuitive tools and community...',
  },
  facebookLink: 'https://facebook.com/your-page',
  instaLink: 'https://instagram.com/your-page',
  twitterLink: 'https://twitter.com/your-page',
  githubLink: 'https://github.com/your-org',
  dribbbleLink: 'https://dribbble.com/your-page',
  publicItineraries: '/public',
  help: { support: '/support' },
  contact: {
    email: 'hello@globetrotter.app',
    phone: '+91-XXXXXXXXXX',
    address: 'Your office address',
  },
};
*/
