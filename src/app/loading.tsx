export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-offwhite">
      {/* Spinning gold ring */}
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold" />
      <p className="mt-6 font-display text-lg tracking-[0.3em] text-black/30">
        STONEHOUSE
      </p>
    </div>
  );
}
