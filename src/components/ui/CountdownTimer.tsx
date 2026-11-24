"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  title: string;
  description?: string;
}

export default function CountdownTimer({ targetDate, title, description }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date().getTime();
      const diff = targetDate.getTime() - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="text-center">
      <p className="small-label mb-3">{title}</p>
      {description && <p className="mb-6 text-sm text-muted">{description}</p>}
      <div className="flex items-center justify-center gap-4">
        {units.map((unit) => (
          <div key={unit.label} className="min-w-[4rem]">
            <p className="font-display text-display-md text-gold">
              {String(unit.value).padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted">{unit.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
