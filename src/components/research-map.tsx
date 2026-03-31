"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as d3 from "d3";
import { continents, type ResearchNode, type Continent } from "@/lib/map-data";

interface ResearchMapProps {
  onNodeClick: (node: ResearchNode) => void;
  onContinentClick: (continent: Continent) => void;
  searchHighlight?: string;
}

export function ResearchMap({
  onNodeClick,
  onContinentClick,
  searchHighlight,
}: ResearchMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredNode, setHoveredNode] = useState<ResearchNode | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Handle resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Render map
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const padding = 40;

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        mainGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    const mainGroup = svg.append("g");

    // Draw background grid
    const gridGroup = mainGroup.append("g").attr("class", "grid");
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * (width - 2 * padding);
      const y = padding + (i / 10) * (height - 2 * padding);
      gridGroup
        .append("line")
        .attr("x1", x).attr("y1", padding)
        .attr("x2", x).attr("y2", height - padding)
        .attr("stroke", "rgba(255,255,255,0.03)")
        .attr("stroke-width", 1);
      gridGroup
        .append("line")
        .attr("x1", padding).attr("y1", y)
        .attr("x2", width - padding).attr("y2", y)
        .attr("stroke", "rgba(255,255,255,0.03)")
        .attr("stroke-width", 1);
    }

    // Axis labels
    mainGroup
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 8)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.3)")
      .attr("font-size", "11px")
      .text("研究对象尺度 →  亚原子  ·  分子  ·  细胞  ·  个体  ·  地球  ·  宇宙");

    mainGroup
      .append("text")
      .attr("transform", `rotate(-90)`)
      .attr("x", -(height / 2))
      .attr("y", 14)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.3)")
      .attr("font-size", "11px")
      .text("← 基础研究  ·  应用研究  ·  商业化 →");

    // Draw continent regions
    continents.forEach((continent) => {
      const cx =
        padding +
        ((continent.xRange[0] + continent.xRange[1]) / 2) *
          (width - 2 * padding);
      const cy =
        padding +
        ((continent.yRange[0] + continent.yRange[1]) / 2) *
          (height - 2 * padding);
      const rw =
        ((continent.xRange[1] - continent.xRange[0]) / 2) *
        (width - 2 * padding);
      const rh =
        ((continent.yRange[1] - continent.yRange[0]) / 2) *
        (height - 2 * padding);

      // Continent background glow
      const gradient = svg
        .append("defs")
        .append("radialGradient")
        .attr("id", `glow-${continent.id}`);
      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", continent.color)
        .attr("stop-opacity", 0.08);
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", continent.color)
        .attr("stop-opacity", 0);

      mainGroup
        .append("ellipse")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("rx", rw)
        .attr("ry", rh)
        .attr("fill", `url(#glow-${continent.id})`)
        .attr("cursor", "pointer")
        .on("click", () => onContinentClick(continent));

      // Continent label
      mainGroup
        .append("text")
        .attr("x", cx)
        .attr("y", cy - rh + 16)
        .attr("text-anchor", "middle")
        .attr("fill", continent.color)
        .attr("font-size", "13px")
        .attr("font-weight", "600")
        .attr("opacity", 0.7)
        .attr("cursor", "pointer")
        .text(continent.name)
        .on("click", () => onContinentClick(continent));
    });

    // Draw research nodes
    const allNodes = continents.flatMap((c) => c.nodes);

    // Ambient particles (background decoration)
    for (let i = 0; i < 200; i++) {
      const c = continents[Math.floor(Math.random() * continents.length)];
      const nx =
        padding +
        (c.xRange[0] + Math.random() * (c.xRange[1] - c.xRange[0])) *
          (width - 2 * padding);
      const ny =
        padding +
        (c.yRange[0] + Math.random() * (c.yRange[1] - c.yRange[0])) *
          (height - 2 * padding);
      mainGroup
        .append("circle")
        .attr("cx", nx + (Math.random() - 0.5) * 30)
        .attr("cy", ny + (Math.random() - 0.5) * 30)
        .attr("r", Math.random() * 1.5 + 0.3)
        .attr("fill", c.color)
        .attr("opacity", Math.random() * 0.3 + 0.05);
    }

    // Draw main nodes
    allNodes.forEach((node) => {
      const nx = padding + node.x * (width - 2 * padding);
      const ny = padding + node.y * (height - 2 * padding);
      const radius = node.size * 3 + 4;

      const isHighlighted =
        searchHighlight &&
        (node.name.includes(searchHighlight) ||
          node.nameEn.toLowerCase().includes(searchHighlight.toLowerCase()));

      // Node glow
      mainGroup
        .append("circle")
        .attr("cx", nx)
        .attr("cy", ny)
        .attr("r", radius * 2.5)
        .attr("fill", node.color)
        .attr("opacity", isHighlighted ? 0.15 : 0.06);

      // Node circle
      mainGroup
        .append("circle")
        .attr("cx", nx)
        .attr("cy", ny)
        .attr("r", radius)
        .attr("fill", node.color)
        .attr("opacity", isHighlighted ? 1 : 0.7)
        .attr("stroke", isHighlighted ? "#fff" : "none")
        .attr("stroke-width", isHighlighted ? 2 : 0)
        .attr("cursor", "pointer")
        .on("click", () => onNodeClick(node))
        .on("mouseenter", (event) => {
          setHoveredNode(node);
          setTooltipPos({ x: event.clientX, y: event.clientY });
        })
        .on("mousemove", (event) => {
          setTooltipPos({ x: event.clientX, y: event.clientY });
        })
        .on("mouseleave", () => {
          setHoveredNode(null);
        });

      // Node label
      mainGroup
        .append("text")
        .attr("x", nx)
        .attr("y", ny + radius + 14)
        .attr("text-anchor", "middle")
        .attr("fill", "rgba(255,255,255,0.7)")
        .attr("font-size", "10px")
        .attr("pointer-events", "none")
        .text(node.name);
    });
  }, [dimensions, searchHighlight, onNodeClick, onContinentClick]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-0">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block"
      />
      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 rounded-lg border border-border bg-card/95 backdrop-blur-sm shadow-xl"
          style={{
            left: tooltipPos.x + 12,
            top: tooltipPos.y - 10,
          }}
        >
          <div className="font-semibold text-sm">{hoveredNode.name}</div>
          <div className="text-xs text-muted-foreground">
            {hoveredNode.nameEn}
          </div>
          <div className="mt-1 text-xs text-muted-foreground flex gap-3">
            <span>论文 {hoveredNode.papers.toLocaleString()}</span>
            <span>学者 {hoveredNode.scholars.toLocaleString()}</span>
          </div>
          <div className="mt-1 text-xs">
            <span
              className="inline-block w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: hoveredNode.color }}
            />
            研究密度: {"●".repeat(hoveredNode.size)}
            {"○".repeat(5 - hoveredNode.size)}
          </div>
        </div>
      )}
    </div>
  );
}
