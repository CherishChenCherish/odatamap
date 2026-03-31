"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { searchNodes, type ResearchNode } from "@/lib/map-data";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onNodeSelect: (node: ResearchNode) => void;
}

export function SearchBar({ onSearch, onNodeSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResearchNode[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);
      if (value.length > 0) {
        setResults(searchNodes(value).slice(0, 8));
        setShowResults(true);
      } else {
        setResults([]);
        setShowResults(false);
      }
    },
    [onSearch]
  );

  return (
    <div className="relative">
      <Input
        placeholder="搜索研究领域、论文、学者..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => query.length > 0 && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        className="bg-card/80 backdrop-blur-sm border-border/50 h-10 w-72 text-sm"
      />
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          {results.map((node) => (
            <button
              key={node.id}
              className="w-full px-3 py-2 text-left hover:bg-accent/50 flex items-center gap-2 transition-colors"
              onClick={() => {
                onNodeSelect(node);
                setShowResults(false);
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: node.color }}
              />
              <span className="text-sm">{node.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {node.nameEn}
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {node.papers.toLocaleString()} 篇
              </Badge>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
