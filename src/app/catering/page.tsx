import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import InquiryCTA from "@/components/sections/InquiryCTA";
import { getBreadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Catering & Cuisine | Stone House Nevada City",
  description:
    "From plated dinners to craft cocktail bars, Stone House catering creates memorable culinary experiences using local Gold Country ingredients. View sample menus.",
  openGraph: {
    title: "Catering & Cuisine | Stone House Nevada City",
    description:
      "From plated dinners to craft cocktail bars, Stone House catering creates memorable culinary experiences using local Gold Country ingredients. View sample menus.",
  },
  robots: { index: true, follow: true },
};

const menuCategories = [
  {
    name: "Appetizers & Passed Bites",
    description:
      "Start the evening with locally inspired small plates and passed hors d'oeuvres crafted from seasonal Gold Country ingredients.",
    items: [
      "Seasonal bruschetta with heirloom tomatoes and basil",
      "Charcuterie boards with local cheeses and house-cured meats",
      "Wild mushroom arancini with truffle aioli",
      "Smoked salmon crostini with dill crème fraîche",
      "Mini caprese skewers with aged balsamic reduction",
    ],
  },
  {
    name: "Entrees",
    description:
      "Plated dinners, family-style feasts, or buffet service — every option features locally sourced proteins and seasonal produce.",
    items: [
      "Herb-crusted filet mignon with red wine reduction",
      "Pan-seared salmon with citrus beurre blanc",
      "Slow-roasted tri-tip with chimichurri",
      "Free-range chicken with roasted garlic and thyme",
      "Braised pork loin with apple cider glaze",
      "Seasonal vegetable risotto (vegetarian)",
    ],
  },
  {
    name: "Desserts",
    description:
      "Sweet endings that complement the evening, from plated desserts to self-serve stations.",
    items: [
      "Seasonal fruit tarts with house-made pastry cream",
      "Dark chocolate mousse with Gold Country honey",
      "Mini cheesecakes with berry compote",
      "Artisan cookie and brownie platters",
      "Custom wedding cake coordination with local bakers",
    ],
  },
  {
    name: "Craft Cocktails & Beverages",
    description:
      "Our full bar program features craft cocktails, curated wines, and local craft beers — plus non-alcoholic options.",
    items: [
      "Signature cocktails designed for your event",
      "Curated wine list featuring California and Gold Country vineyards",
      "Local craft beer selection",
      "Non-alcoholic craft mocktails",
      "Espresso and specialty coffee station",
    ],
  },
];

const dietaryOptions = [
  "Vegetarian & Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Nut-Free",
  "Kosher-style",
  "Custom dietary requirements",
];

export default function CateringPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://stonehouse.io" },
              { name: "Catering", url: "https://stonehouse.io/catering" },
            ])
          ),
        }}
      />

      {/* ── Hero ─────────────────────────────────── */}
      <section className="section-dark pb-section-sm pt-40">
        <div className="mx-auto max-w-[80rem] px-6 text-center">
          <p className="small-label mb-4">Culinary Experiences</p>
          <h1 className="font-display text-display-lg text-cream">
            Catering & Cuisine
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/50">
            Locally sourced ingredients, seasonal menus, and a culinary team
            dedicated to making every plate as memorable as the venue itself.
          </p>
        </div>
      </section>

      {/* ── Intro ────────────────────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-md text-cream">
              From Kitchen to Table
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-cream/60">
              Stone House works with a curated network of preferred caterers who
              know our kitchen, our spaces, and our standards. Every menu is
              built around seasonal, locally sourced ingredients from Gold
              Country farms and producers — and we&apos;re proud to be seed
              oil-free.
            </p>
          </div>
        </div>
      </section>

      {/* ── Menu Categories ──────────────────────── */}
      <section className="bg-surface-100 py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="text-center">
            <div className="gold-divider mx-auto mb-6" />
            <h2 className="font-display text-display-md text-cream">
              Sample Menu
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-cream/50">
              Every menu is customizable. These are starting points to inspire
              your vision.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {menuCategories.map((category) => (
              <div
                key={category.name}
                className="rounded-sm border border-surface-400 bg-surface-200 p-8"
              >
                <h3 className="font-display text-xl font-semibold text-cream">
                  {category.name}
                </h3>
                <p className="mt-2 text-sm text-cream/50">
                  {category.description}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-cream/60"
                    >
                      <Check
                        size={14}
                        className="mt-0.5 shrink-0 text-gold"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dietary Accommodations ────────────────── */}
      <section className="bg-surface py-section">
        <div className="mx-auto max-w-[80rem] px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-md text-cream">
                Dietary Accommodations
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-cream/60">
                Every guest deserves to enjoy the meal. Our catering partners
                work with all dietary needs and restrictions — just let us know
                during the planning process and we&apos;ll ensure every plate is
                accounted for.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {dietaryOptions.map((option) => (
                  <span
                    key={option}
                    className="rounded-sm border border-gold/20 bg-gold/5 px-4 py-2 text-sm text-cream/60"
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="gold-divider mb-6" />
              <h2 className="font-display text-display-md text-cream">
                Beverage Packages
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-cream/60">
                Stone House features a craft cocktail program with full bar
                service. Choose from hosted bar, cash bar, or consumption-based
                packages — all with bartending staff and glassware included.
              </p>
              <div className="mt-6">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-gold-dark"
                >
                  View bar package pricing
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="bg-black py-section">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mx-auto mb-8 h-px w-16 bg-gold/40" />
          <h2 className="font-display text-display-md text-white">
            Let&apos;s Build Your Menu
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/50">
            Tell us about your event and we&apos;ll connect you with our
            culinary team to create a custom menu that matches your vision,
            guest count, and budget.
          </p>
          <div className="mt-8">
            <Button href="/inquiry" variant="primary" size="lg">
              Start Planning
            </Button>
          </div>
        </div>
      </section>

      <InquiryCTA />
    </main>
  );
}
