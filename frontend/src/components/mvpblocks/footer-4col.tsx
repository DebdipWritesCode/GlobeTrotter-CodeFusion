import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  MapPin,
  Phone,
  Globe,
  Users,
  Calendar,
  Map,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { footerData as data } from '@/constants/landing';

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/globetrotter' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/globetrotter_travels' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/globetrotter' },
];

const exploreLinks = [
  { text: 'Destinations', href: '/search' },
  { text: 'Community', href: '/community' },
  { text: 'Travel Guides', href: '/guides' },
  { text: 'Travel Stories', href: '/stories' },
];

const planningLinks = [
  { text: 'Create Trip', href: '/create-trip' },
  { text: 'My Itineraries', href: '/dashboard' },
  { text: 'Calendar', href: '/calendar' },
  { text: 'Travel Budget', href: '/budget' },
];

const supportLinks = [
  { text: 'Help Center', href: '/help' },
  { text: 'FAQs', href: '/faqs' },
  { text: 'Contact Support', href: '/support' },
  { text: 'Live Chat', href: '/chat', hasIndicator: true },
];

const contactInfo = [
  { icon: Mail, text: 'hello@globetrotter.com' },
  { icon: Phone, text: '+1 (888) 456-7890' },
  { icon: MapPin, text: 'San Francisco, CA', isAddress: true },
];

export default function Footer4Col() {
  return (
    <footer className="bg-gradient-to-br from-emerald-900/90 to-green-800/90 dark:from-emerald-950 dark:to-green-950 mt-16 w-full place-self-end rounded-t-xl backdrop-blur-sm">
      <div className="mx-auto max-w-screen-xl px-4 pt-16 pb-6 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-white flex justify-center gap-2 sm:justify-start">
              <img
                src={'/logo.svg'}
                alt="GlobeTrotter logo"
                className="h-8 w-8 rounded-full bg-white/10 p-1"
                width={32}
                height={32}
              />
              <span className="text-2xl font-semibold">
                GlobeTrotter
              </span>
            </div>

            <p className="text-emerald-100/80 mt-6 max-w-md text-center leading-relaxed sm:max-w-xs sm:text-left">
              Your personalized travel companion. Discover, plan, and share your adventures with fellow travelers around the world.
            </p>

            <ul className="mt-8 flex justify-center gap-6 sm:justify-start md:gap-8">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-emerald-200 hover:text-white transition-colors"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="size-6" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:col-span-2">
            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white flex items-center gap-2">
                <Globe className="size-5" /> Explore
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                {exploreLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-emerald-100/80 hover:text-white transition-colors"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white flex items-center gap-2">
                <Map className="size-5" /> Trip Planning
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                {planningLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      className="text-emerald-100/80 hover:text-white transition-colors"
                      to={href}
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left">
              <p className="text-lg font-medium text-white flex items-center gap-2">
                <Users className="size-5" /> Support
              </p>
              <ul className="mt-6 space-y-4 text-sm">
                {supportLinks.map(({ text, href, hasIndicator }) => (
                  <li key={text}>
                    <Link
                      to={href}
                      className={`${
                        hasIndicator
                          ? 'group flex justify-center gap-1.5 sm:justify-start'
                          : 'text-emerald-100/80 hover:text-white transition-colors'
                      }`}
                    >
                      <span className="text-emerald-100/80 hover:text-white transition-colors">
                        {text}
                      </span>
                      {hasIndicator && (
                        <span className="relative flex size-2">
                          <span className="bg-emerald-300 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                          <span className="bg-emerald-400 relative inline-flex size-2 rounded-full" />
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-emerald-700/30 pt-6">
          <div className="text-center sm:flex sm:justify-between sm:text-left">
            <p className="text-sm text-emerald-100/80">
              <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              <span className="mx-2">•</span>
              <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            </p>

            <p className="text-emerald-200/70 mt-4 text-sm transition sm:order-first sm:mt-0">
              &copy; {new Date().getFullYear()} GlobeTrotter. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}