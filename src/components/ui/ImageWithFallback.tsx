"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

type ImageWithFallbackProps = Omit<ImageProps, "onError"> & {
  fallbackText?: string;
};

export default function ImageWithFallback({
  fallbackText = "Photo Coming Soon",
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-stone-dark"
        style={{
          width: typeof props.width === "number" ? props.width : "100%",
          height: typeof props.height === "number" ? props.height : "100%",
          aspectRatio:
            props.width && props.height
              ? `${props.width} / ${props.height}`
              : undefined,
        }}
      >
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-32 opacity-40"
        >
          <rect
            x="20"
            y="20"
            width="160"
            height="120"
            rx="4"
            stroke="#A8892E"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
          <circle cx="70" cy="60" r="16" stroke="#A8892E" strokeWidth="2" />
          <path
            d="M20 120 L80 80 L120 100 L160 60 L180 80 L180 140 L20 140Z"
            fill="#A8892E"
            fillOpacity="0.1"
          />
          <text
            x="100"
            y="155"
            textAnchor="middle"
            fill="#A8892E"
            fontSize="10"
            fontFamily="sans-serif"
          >
            {fallbackText}
          </text>
        </svg>
      </div>
    );
  }

  return <Image alt={alt} onError={() => setError(true)} {...props} />;
}
