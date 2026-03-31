"use client";

import { continents, type Continent } from "@/lib/map-data";

interface ContinentLegendProps {
  onContinentClick: (continent: Continent) => void;
}

export function ContinentLegend({ onContinentClick }: ContinentLegendProps) {
  return (
    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto max-w-[calc(100vw-2rem)] pb-1 scrollbar-hide">
      {continents.map((c) => (
        <button
          key={c.id}
          onClick={() => onContinentClick(c)}
          className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full border border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-colors text-[10px] sm:text-xs whitespace-nowrap shrink-0"
        >
          <span
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full"
            style={{ backgroundColor: c.color }}
          />
          <span>{c.name}</span>
        </button>
      ))}
    </div>
  );
}
