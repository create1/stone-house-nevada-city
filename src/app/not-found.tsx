import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
      <p className="font-display text-8xl font-semibold text-gold/20">404</p>
      <h1 className="mt-4 font-display text-display-md text-white">
        This Page Doesn&apos;t Exist
      </h1>
      <p className="mt-3 max-w-md text-white/50">
        The page you&apos;re looking for may have been moved or no longer
        exists. Let&apos;s get you back on track.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Button href="/" variant="primary" size="md">
          Back to Home
        </Button>
        <Button href="/venue/spaces" variant="ghost" size="md">
          Explore Spaces
        </Button>
      </div>
    </main>
  );
}
