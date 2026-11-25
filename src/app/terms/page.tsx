import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Stone House Nevada City",
  description:
    "Terms governing use of the Stone House Nevada City website, inquiries, content, and internal services.",
  robots: { index: true, follow: true },
};

const sectionClass = "space-y-4";
const headingClass = "font-display text-3xl text-cream";
const paragraphClass = "leading-8 text-cream/70";

export default function TermsPage() {
  return (
    <main className="bg-surface">
      <section className="section-dark pb-section-sm pt-40">
        <div className="mx-auto max-w-4xl px-6">
          <p className="small-label mb-4">Legal</p>
          <h1 className="font-display text-display-lg text-cream">Terms of Use</h1>
          <p className="mt-4 text-cream/50">
            Stone House Nevada City · Last updated November 24, 2026
          </p>
        </div>
      </section>

      <section className="py-section">
        <div className="mx-auto max-w-4xl space-y-12 px-6">
          <p className={paragraphClass}>
            These Terms of Use apply to the website at www.stonehouse.io (the
            &quot;Site&quot;), operated by Stonehouse LLC, doing business as
            Stone House (&quot;Stone House&quot;, &quot;we&quot;,
            &quot;us&quot;), 107 Sacramento Street, Nevada City, California
            95959. By using the Site you agree to these terms. If you do not
            agree, please do not use the Site.
          </p>

          <section className={sectionClass}>
            <h2 className={headingClass}>Using the Site</h2>
            <p className={paragraphClass}>
              You may use the Site to learn about Stone House, view our spaces
              and services, and contact us about tours and private events. You
              agree not to:
            </p>
            <ul className="list-disc space-y-3 pl-6 leading-8 text-cream/70">
              <li>
                use the Site for any unlawful purpose or in violation of any
                applicable law;
              </li>
              <li>
                attempt to gain unauthorized access to any part of the Site or
                its systems;
              </li>
              <li>
                interfere with the Site&apos;s operation, or submit false,
                misleading or automated inquiries;
              </li>
              <li>
                reproduce, distribute or create derivative works from Site
                content without our written permission.
              </li>
            </ul>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Inquiries, tours and bookings</h2>
            <p className={paragraphClass}>
              Submitting a form, requesting pricing or scheduling a tour does
              not reserve a date or create a booking. A date is held and an
              event is booked only under a written agreement signed by you and
              Stone House, and that agreement governs the event. If anything
              on the Site differs from your signed agreement, the signed
              agreement controls.
            </p>
            <p className={paragraphClass}>
              Descriptions, photos, floor plans, menus, capacities and rates on
              the Site are provided for general information and may change
              without notice. Current details are confirmed in your proposal
              and agreement.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Content and intellectual property</h2>
            <p className={paragraphClass}>
              The Site and its content, including text, photographs, logos and
              design, belong to Stone House or its licensors and are protected
              by law. You may view and share pages for personal, non-commercial
              purposes. Any other use requires our written permission.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Communications</h2>
            <p className={paragraphClass}>
              If you give us your contact details, we may reply by email, phone
              or text about your inquiry. You can ask us to stop at any time.
              How we handle personal information is described in our{" "}
              <Link
                href="https://www.stonehouse.io/privacy-policy/"
                className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-light"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Internal software and integrations</h2>
            <p className={paragraphClass}>
              Stone House uses internal software tools and integrations to run
              its own business, including tools that connect to its own
              accounting and booking accounts. These tools are used only by
              Stone House and its authorized staff, are not offered to the
              public, and access only Stone House&apos;s own business accounts.
              Authorized users must keep login credentials confidential and
              use these tools only for Stone House business.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Third-party links and services</h2>
            <p className={paragraphClass}>
              The Site may link to or embed services run by others, such as
              booking, scheduling, maps or social media. We do not control
              those services and are not responsible for their content or
              practices. Their own terms and privacy policies apply.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Disclaimer</h2>
            <p className={paragraphClass}>
              The Site is provided &quot;as is&quot; and &quot;as
              available&quot;. To the fullest extent permitted by law, Stone
              House disclaims all warranties, express or implied, regarding the
              Site and its content, including accuracy, availability and
              fitness for a particular purpose.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Limitation of liability</h2>
            <p className={paragraphClass}>
              To the fullest extent permitted by law, Stone House is not liable
              for any indirect, incidental, special or consequential damages
              arising from your use of the Site. Nothing in these terms limits
              any rights or remedies under a signed event agreement with Stone
              House.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Changes to these terms</h2>
            <p className={paragraphClass}>
              We may update these terms from time to time. The date at the top
              shows the latest version. Continued use of the Site after a
              change means you accept the revised terms.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Governing law</h2>
            <p className={paragraphClass}>
              These terms are governed by the laws of the State of California.
              Any dispute relating to the Site will be brought in the state or
              federal courts serving Nevada County, California.
            </p>
          </section>

          <section className={sectionClass}>
            <h2 className={headingClass}>Contact</h2>
            <p className={paragraphClass}>
              Questions about these terms:{" "}
              <a
                href="mailto:bookings@stonehouse.io"
                className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-light"
              >
                bookings@stonehouse.io
              </a>{" "}
              or{" "}
              <a
                href="tel:+15302655050"
                className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-gold-light"
              >
                (530) 265-5050
              </a>
              .
            </p>
            <p className={paragraphClass}>
              Stonehouse LLC, dba Stone House · 107 Sacramento Street, Nevada
              City, California 95959
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
