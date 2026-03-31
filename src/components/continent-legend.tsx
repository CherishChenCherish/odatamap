"use client";

import { continents, type Continent } from "@/lib/map-data";

interface ContinentLegendProps {
  onContinentClick: (continent: Continent) => void;
}

export function ContinentLegend({ onContinentClick }: ContinentLegendProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {continents.map((c) => (
        <button
          key={c.id}
          onClick={() => onContinentClick(c)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-colors text-xs"
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: c.color }}
          />
          <span>{c.name}</span>
        </button>
      ))}
    </div>
  );
}
