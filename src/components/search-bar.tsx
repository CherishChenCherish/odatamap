"use client";

import { useState, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { searchNodes, type ResearchNode } from "@/lib/map-data";

interface SearchResult {
  type: "local" | "paper" | "author";
  id: string;
  title: string;
  subtitle: string;
  color?: string;
  meta?: string;
}

interface SearchBarProps {
  onSearch: (query: string) => void;
  onNodeSelect: (node: ResearchNode) => void;
}

export function SearchBar({ onSearch, onNodeSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchRemoteResults = useCallback(async (q: string) => {
    if (q.length < 2) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=papers`);
      if (!res.ok) return;
      const data = await res.json();
      const paperResults: SearchResult[] = data.papers
        .slice(0, 5)
        .map((p: { id: string; title: string; journal: string; year: number; citations: number }) => ({
          type: "paper" as const,
          id: p.id,
          title: p.title,
          subtitle: p.journal,
          meta: `${p.year} · ${p.citations} 引用`,
        }));

      setResults((prev) => {
        const locals = prev.filter((r) => r.type === "local");
        return [...locals, ...paperResults];
      });
    } catch {
      // silently fail for remote search
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);

      if (value.length > 0) {
        // Local results (instant)
        const localResults: SearchResult[] = searchNodes(value)
          .slice(0, 4)
          .map((n) => ({
            type: "local" as const,
            id: n.id,
            title: n.name,
            subtitle: n.nameEn,
            color: n.color,
            meta: `${n.papers.toLocaleString()} 篇`,
          }));
        setResults(localResults);
        setShowResults(true);

        // Remote results (debounced)
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchRemoteResults(value), 400);
      } else {
        setResults([]);
        setShowResults(false);
      }
    },
    [onSearch, fetchRemoteResults]
  );

  const handleSelect = (result: SearchResult) => {
    if (result.type === "local") {
      const node = searchNodes(result.title)[0];
      if (node) onNodeSelect(node);
    } else if (result.type === "paper") {
      window.location.href = `/paper/${result.id}`;
    } else if (result.type === "author") {
      window.location.href = `/scholar/${result.id}`;
    }
    setShowResults(false);
  };

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
        <div className="absolute top-full mt-1 w-96 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          {results.some((r) => r.type === "local") && (
            <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-b border-border/50 font-medium">
              地图领域
            </div>
          )}
          {results
            .filter((r) => r.type === "local")
            .map((result) => (
              <button
                key={result.id}
                className="w-full px-3 py-2 text-left hover:bg-accent/50 flex items-center gap-2 transition-colors"
                onClick={() => handleSelect(result)}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: result.color }}
                />
                <span className="text-sm">{result.title}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {result.subtitle}
                </span>
                {result.meta && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    {result.meta}
                  </Badge>
                )}
              </button>
            ))}

          {results.some((r) => r.type === "paper") && (
            <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-b border-border/50 border-t font-medium">
              OpenAlex 论文 {loading && "..."}
            </div>
          )}
          {results
            .filter((r) => r.type === "paper")
            .map((result) => (
              <button
                key={result.id}
                className="w-full px-3 py-2 text-left hover:bg-accent/50 flex items-start gap-2 transition-colors"
                onClick={() => handleSelect(result)}
              >
                <Badge
                  variant="outline"
                  className="text-[10px] px-1 py-0 shrink-0 mt-0.5"
                >
                  论文
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm truncate">{result.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {result.subtitle} · {result.meta}
                  </p>
                </div>
              </button>
            ))}

          {loading && !results.some((r) => r.type === "paper") && (
            <div className="px-3 py-2 text-xs text-muted-foreground text-center">
              搜索论文中...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
