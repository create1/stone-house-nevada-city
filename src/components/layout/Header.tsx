"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Menu, X, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

const spaceLinks = [
  { label: "Music Venue", href: "/venue/music-venue" },
  { label: "Tavern", href: "/venue/tavern" },
  { label: "Dining Room", href: "/venue/dining-room" },
  { label: "Lounge", href: "/venue/lounge" },
  { label: "Wine Cavern", href: "/venue/wine-cavern" },
  { label: "Patio", href: "/venue/patio" },
  { label: "Full Building", href: "/venue/spaces" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // Route changes are an external navigation event; reset transient menu state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleDropdown = useCallback((name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-[80rem] items-center justify-between px-6 py-4">
        {/* Logo — "STONE HOUSE | Est. 1857" */}
        <Link
          href="/"
          className="flex items-center gap-3 font-display text-xl tracking-[0.15em] text-white"
        >
          <span className="font-light">STONE HOUSE</span>
          <span className="text-white/30">|</span>
          <span className="text-sm font-light tracking-[0.2em] text-white/50">Est. 1857</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-7 lg:flex">
          <NavDropdown
            label="Spaces"
            links={spaceLinks}
            open={openDropdown === "spaces"}
            onToggle={() => toggleDropdown("spaces")}
            onClose={() => setOpenDropdown(null)}
          />
          <NavLink href="/events/weddings">Weddings</NavLink>
          <NavLink href="/catering">Catering</NavLink>
          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/about">About</NavLink>
          <Button href="/inquiry" size="sm" variant="primary">
            Check Availability
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="text-white lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <div
        className={clsx(
          "fixed inset-0 top-0 z-40 flex flex-col bg-black transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 font-display text-xl tracking-[0.15em] text-white"
            onClick={() => setMobileOpen(false)}
          >
            <span className="font-light">STONE HOUSE</span>
            <span className="text-white/30">|</span>
            <span className="text-sm font-light tracking-[0.2em] text-white/50">Est. 1857</span>
          </Link>
          <button
            className="text-white"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <MobileDropdown
            label="Spaces"
            links={spaceLinks}
            open={openDropdown === "mobile-spaces"}
            onToggle={() => toggleDropdown("mobile-spaces")}
          />
          <MobileLink href="/events/weddings">Weddings</MobileLink>
          <MobileLink href="/catering">Catering</MobileLink>
          <MobileLink href="/gallery">Gallery</MobileLink>
          <MobileLink href="/pricing">Pricing</MobileLink>
          <MobileLink href="/about">About</MobileLink>

          <div className="mt-8">
            <Button href="/inquiry" size="lg" variant="primary" className="w-full">
              Check Availability
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Desktop sub-components ────────────────────── */

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-[0.8125rem] font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-gold"
    >
      {children}
    </Link>
  );
}

function NavDropdown({
  label,
  links,
  open,
  onToggle,
  onClose,
}: {
  label: string;
  links: { label: string; href: string }[];
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onToggle}
      onMouseLeave={onClose}
    >
      <button
        className="flex items-center gap-1 text-[0.8125rem] font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-gold"
        onClick={onToggle}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={14}
          className={clsx(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={clsx(
          "absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-all duration-200",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <div className="min-w-[220px] rounded-sm border border-white/10 bg-black/95 py-2 shadow-xl backdrop-blur-md">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-5 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Mobile sub-components ─────────────────────── */

function MobileLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block border-b border-white/10 py-4 font-display text-xl text-white transition-colors hover:text-gold"
    >
      {children}
    </Link>
  );
}

function MobileDropdown({
  label,
  links,
  open,
  onToggle,
}: {
  label: string;
  links: { label: string; href: string }[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/10">
      <button
        className="flex w-full items-center justify-between py-4 font-display text-xl text-white"
        onClick={onToggle}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={20}
          className={clsx(
            "text-gold transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <div
        className={clsx(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[500px] pb-2" : "max-h-0",
        )}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block py-2 pl-4 text-base text-white/60 transition-colors hover:text-gold"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
