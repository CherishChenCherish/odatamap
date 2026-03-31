"use client";

import { useState, useCallback } from "react";
import { ResearchMap } from "@/components/research-map";
import { SearchBar } from "@/components/search-bar";
import { NodeDetailPanel } from "@/components/node-detail-panel";
import { ContinentLegend } from "@/components/continent-legend";
import { DataStream } from "@/components/data-stream";
import { AIAssistant } from "@/components/ai-assistant";
import type { ResearchNode, Continent } from "@/lib/map-data";

export default function Home() {
  const [selectedNode, setSelectedNode] = useState<ResearchNode | null>(null);
  const [selectedContinent, setSelectedContinent] = useState<Continent | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const handleNodeClick = useCallback((node: ResearchNode) => {
    setSelectedNode(node);
    setSelectedContinent(null);
  }, []);

  const handleContinentClick = useCallback((continent: Continent) => {
    setSelectedContinent(continent);
    setSelectedNode(null);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedNode(null);
    setSelectedContinent(null);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="shrink-0 border-b border-border/50 bg-card/50 backdrop-blur-sm z-30">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                O
              </div>
              <div>
                <h1 className="text-sm font-semibold leading-tight">
                  科研数据地图
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  实验前，先看全景
                </p>
              </div>
            </div>
          </div>

          <SearchBar onSearch={handleSearch} onNodeSelect={handleNodeClick} />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden md:inline">滚轮缩放 · 拖拽平移</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 min-h-0">
        {/* Map area */}
        <div className="flex-1 relative min-w-0">
          <ResearchMap
            onNodeClick={handleNodeClick}
            onContinentClick={handleContinentClick}
            searchHighlight={searchQuery}
          />

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 z-20">
            <ContinentLegend onContinentClick={handleContinentClick} />
          </div>

          {/* Stats overlay */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-card/60 backdrop-blur-sm border border-border/30 text-xs">
              <span className="text-muted-foreground">覆盖领域</span>{" "}
              <span className="font-mono font-medium">7 大陆 · 45 方向</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-card/60 backdrop-blur-sm border border-border/30 text-xs">
              <span className="text-muted-foreground">数据量</span>{" "}
              <span className="font-mono font-medium">50万+ 论文</span>
            </div>
          </div>

          {/* Detail panel */}
          <NodeDetailPanel
            node={selectedNode}
            continent={selectedContinent}
            onClose={handleClose}
          />
        </div>

        {/* Right sidebar - data stream */}
        <div className="hidden lg:block w-72 border-l border-border/50 bg-card/30">
          <DataStream />
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}
