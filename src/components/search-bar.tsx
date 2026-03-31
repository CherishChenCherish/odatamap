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
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchRemoteResults = useCallback(async (q: string) => {
    if (q.length < 2) return;
    setLoading(true);
    setShowResults(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&type=papers`
      );
      if (!res.ok) return;
      const data = await res.json();
      const paperResults: SearchResult[] = data.papers
        .slice(0, 5)
        .map(
          (p: {
            id: string;
            title: string;
            journal: string;
            year: number;
            citations: number;
          }) => ({
            type: "paper" as const,
            id: p.id,
            title: p.title,
            subtitle: p.journal,
            meta: `${p.year} · ${p.citations} 引用`,
          })
        );

      setResults((prev) => {
        const locals = prev.filter((r) => r.type === "local");
        return [...locals, ...paperResults];
      });
      setShowResults(true);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      onSearch(value);

      if (value.length > 0) {
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

  const handleSubmit = () => {
    if (!query.trim()) return;
    // Always trigger a fresh remote search and show results
    const localResults: SearchResult[] = searchNodes(query)
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
    fetchRemoteResults(query);
  };

  // Close dropdown only when clicking outside the entire container
  const handleBlur = (e: React.FocusEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget as Node)
    ) {
      setTimeout(() => setShowResults(false), 150);
    }
  };

  return (
    <div className="relative" ref={containerRef} onBlur={handleBlur}>
      <div className="flex gap-1.5">
        <Input
          placeholder="搜索研究领域、论文、学者..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query.length > 0 && setShowResults(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="bg-card/80 backdrop-blur-sm border-border/50 h-10 w-64 text-sm"
        />
        <button
          onClick={handleSubmit}
          className="h-10 px-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
        >
          搜索
        </button>
      </div>

      {showResults && (
        <div className="absolute top-full mt-1 w-96 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          {results.filter((r) => r.type === "local").length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-b border-border/50 font-medium">
                地图领域
              </div>
              {results
                .filter((r) => r.type === "local")
                .map((result) => (
                  <button
                    key={result.id}
                    className="w-full px-3 py-2 text-left hover:bg-accent/50 flex items-center gap-2 transition-colors"
                    onMouseDown={(e) => e.preventDefault()}
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
            </>
          )}

          {results.filter((r) => r.type === "paper").length > 0 && (
            <>
              <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-b border-border/50 border-t font-medium">
                OpenAlex 论文
              </div>
              {results
                .filter((r) => r.type === "paper")
                .map((result) => (
                  <button
                    key={result.id}
                    className="w-full px-3 py-2 text-left hover:bg-accent/50 flex items-start gap-2 transition-colors"
                    onMouseDown={(e) => e.preventDefault()}
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
            </>
          )}

          {loading && (
            <div className="px-3 py-3 text-xs text-muted-foreground text-center border-t border-border/50">
              <span className="animate-pulse">正在搜索 OpenAlex 论文...</span>
            </div>
          )}

          {!loading &&
            results.length === 0 &&
            query.length > 0 && (
              <div className="px-3 py-3 text-xs text-muted-foreground text-center">
                未找到相关结果
              </div>
            )}
        </div>
      )}
    </div>
  );
}
