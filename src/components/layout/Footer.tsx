import Link from "next/link";

const spaceLinks = [
  { label: "Music Venue", href: "/venue/music-venue" },
  { label: "Tavern", href: "/venue/tavern" },
  { label: "Dining Room", href: "/venue/dining-room" },
  { label: "Lounge", href: "/venue/lounge" },
  { label: "Wine Cavern", href: "/venue/wine-cavern" },
  { label: "Patio", href: "/venue/patio" },
  { label: "All Spaces", href: "/venue/spaces" },
];

const eventLinks = [
  { label: "Weddings", href: "/events/weddings" },
  { label: "Corporate", href: "/events/corporate" },
  { label: "Private Dining", href: "/events/private-dining" },
  { label: "Live Music", href: "/events/live-music" },
  { label: "Fundraisers", href: "/events/fundraisers" },
  { label: "Holiday Parties", href: "/events/holiday-parties" },
];

const venueLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/inquiry" },
  { label: "Blog", href: "/blog" },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white/70">
      <div className="mx-auto max-w-[80rem] px-6 py-section">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-3 font-display text-xl tracking-[0.15em] text-white"
            >
              <span className="font-light">STONE HOUSE</span>
              <span className="text-white/30">|</span>
              <span className="text-sm font-light tracking-[0.2em] text-white/50">Est. 1857</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              A historic event venue built in 1857, nestled in the heart of
              Nevada City, California. Six unique spaces for unforgettable
              gatherings.
            </p>
            <address className="mt-6 text-sm not-italic leading-relaxed">
              107 Sacramento St
              <br />
              Nevada City, CA 95959
              <br />
              <a
                href="tel:5302655050"
                className="transition-colors hover:text-gold"
              >
                (530) 265-5050
              </a>
              <br />
              <a
                href="mailto:bookings@stonehouse.io"
                className="transition-colors hover:text-gold"
              >
                bookings@stonehouse.io
              </a>
            </address>

            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com/stonehousenevadacity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stonehouse on Instagram"
                className="text-white/50 transition-colors hover:text-gold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://facebook.com/stonehousenevadacity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stonehouse on Facebook"
                className="text-white/50 transition-colors hover:text-gold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.pinterest.com/stonehousevenue/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Stonehouse on Pinterest"
                className="text-white/50 transition-colors hover:text-gold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" x2="12" y1="17" y2="22" />
                  <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Spaces Column */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-white">
              Spaces
            </h3>
            <ul className="space-y-2.5">
              {spaceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events Column */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-white">
              Events
            </h3>
            <ul className="space-y-2.5">
              {eventLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Venue Column */}
          <div>
            <h3 className="mb-4 font-display text-lg font-semibold text-white">
              Venue
            </h3>
            <ul className="space-y-2.5">
              {venueLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[80rem] flex-col items-center justify-between gap-4 px-6 py-6 text-xs text-white/40 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Stonehouse. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/privacy-policy/" className="transition-colors hover:text-gold">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-gold">
              Terms of Use
            </Link>
            <span>Built in 1857 &middot; Nevada City, California</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
