"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
  grouped?: boolean;
}

export default function FaqAccordion({ items, grouped = false }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (grouped) {
    const categories = Array.from(new Set(items.map((i) => i.category || "General")));
    let globalIdx = 0;

    return (
      <div className="space-y-10">
        {categories.map((cat) => {
          const catItems = items.filter((i) => (i.category || "General") === cat);
          return (
            <div key={cat}>
              <h3 className="mb-4 font-display text-display-sm text-black">{cat}</h3>
              <div className="divide-y divide-stone-dark">
                {catItems.map((item) => {
                  const idx = globalIdx++;
                  const isOpen = openIndex === idx;
                  return (
                    <div key={idx} className="py-4">
                      <button
                        onClick={() => toggle(idx)}
                        className="flex w-full items-center justify-between text-left"
                      >
                        <span className="pr-4 text-base font-medium text-black">
                          {item.question}
                        </span>
                        <ChevronDown
                          size={20}
                          className={`shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${isOpen ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <p className="text-sm leading-relaxed text-black/60">{item.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="divide-y divide-stone-dark">
      {items.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="py-4">
            <button
              onClick={() => toggle(idx)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="pr-4 text-base font-medium text-black">{item.question}</span>
              <ChevronDown
                size={20}
                className={`shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${isOpen ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <p className="text-sm leading-relaxed text-black/60">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
