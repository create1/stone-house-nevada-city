import Button from "@/components/ui/Button";

export default function InquiryCTA() {
  return (
    <section className="bg-black py-section">
      <div className="mx-auto max-w-[80rem] px-6 text-center">
        <div className="gold-divider mx-auto mb-8" />
        <h2 className="font-display text-display-lg text-white">
          Your celebration awaits within these walls
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/60">
          Whether it&apos;s a wedding, a corporate retreat, or a celebration — we&apos;d love to show you the space and talk through your vision.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button href="/inquiry" variant="primary" size="lg">
            Check Your Date &rarr;
          </Button>
          <Button href="/inquiry" variant="ghost" size="lg">
            Send an Inquiry
          </Button>
        </div>
        <p className="mt-6 text-sm text-white/40">
          We respond to all inquiries within 24 hours.
        </p>
      </div>
    </section>
  );
}
