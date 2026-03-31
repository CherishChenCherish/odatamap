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
    const padding = 80; // extra space for axis labels

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        mainGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    const mainGroup = svg.append("g");

    const axisColor = "rgba(180, 160, 120, 0.6)";
    const axisLabelColor = "rgba(180, 160, 120, 0.85)";
    const axisBg = "rgba(40, 35, 25, 0.7)";
    const mapLeft = padding;
    const mapRight = width - padding;
    const mapTop = padding;
    const mapBottom = height - padding;
    const mapW = mapRight - mapLeft;
    const mapH = mapBottom - mapTop;

    // Draw background grid (subtle)
    const gridGroup = mainGroup.append("g").attr("class", "grid");
    for (let i = 0; i <= 20; i++) {
      const x = mapLeft + (i / 20) * mapW;
      const y = mapTop + (i / 20) * mapH;
      gridGroup
        .append("line")
        .attr("x1", x).attr("y1", mapTop)
        .attr("x2", x).attr("y2", mapBottom)
        .attr("stroke", "rgba(255,255,255,0.02)")
        .attr("stroke-width", 1);
      gridGroup
        .append("line")
        .attr("x1", mapLeft).attr("y1", y)
        .attr("x2", mapRight).attr("y2", y)
        .attr("stroke", "rgba(255,255,255,0.02)")
        .attr("stroke-width", 1);
    }

    // ===== X AXIS (bottom) — Research Object Scale =====
    const xAxisY = mapBottom + 8;
    const xAxisGroup = mainGroup.append("g").attr("class", "x-axis");

    // Axis bar background
    xAxisGroup
      .append("rect")
      .attr("x", mapLeft - 5)
      .attr("y", xAxisY)
      .attr("width", mapW + 10)
      .attr("height", 36)
      .attr("rx", 3)
      .attr("fill", axisBg);

    // Axis line
    xAxisGroup
      .append("line")
      .attr("x1", mapLeft).attr("y1", xAxisY + 4)
      .attr("x2", mapRight).attr("y2", xAxisY + 4)
      .attr("stroke", axisColor)
      .attr("stroke-width", 1.5);

    // Tick marks
    for (let i = 0; i <= 40; i++) {
      const tx = mapLeft + (i / 40) * mapW;
      const tickH = i % 8 === 0 ? 8 : 3;
      xAxisGroup
        .append("line")
        .attr("x1", tx).attr("y1", xAxisY + 4)
        .attr("x2", tx).attr("y2", xAxisY + 4 + tickH)
        .attr("stroke", axisColor)
        .attr("stroke-width", i % 8 === 0 ? 1.2 : 0.6);
    }

    // Scale labels with arrows
    const xLabels = [
      { text: "亚原子", pos: 0.1 },
      { text: "分子/细胞", pos: 0.29 },
      { text: "信息/抽象", pos: 0.47 },
      { text: "工程尺度", pos: 0.65 },
      { text: "地球", pos: 0.81 },
      { text: "宇宙", pos: 0.94 },
    ];
    xLabels.forEach((label) => {
      const lx = mapLeft + label.pos * mapW;
      // Arrow
      xAxisGroup
        .append("text")
        .attr("x", lx)
        .attr("y", xAxisY + 18)
        .attr("text-anchor", "middle")
        .attr("fill", axisLabelColor)
        .attr("font-size", "10px")
        .text("↓");
      // Label
      xAxisGroup
        .append("text")
        .attr("x", lx)
        .attr("y", xAxisY + 32)
        .attr("text-anchor", "middle")
        .attr("fill", axisLabelColor)
        .attr("font-size", "11px")
        .attr("font-weight", "500")
        .text(label.text);
    });

    // ===== Y AXIS (left) — Knowledge Maturity =====
    const yAxisX = mapLeft - 8;
    const yAxisGroup = mainGroup.append("g").attr("class", "y-axis");

    // Axis bar background
    yAxisGroup
      .append("rect")
      .attr("x", yAxisX - 58)
      .attr("y", mapTop - 5)
      .attr("width", 56)
      .attr("height", mapH + 10)
      .attr("rx", 3)
      .attr("fill", axisBg);

    // Axis line
    yAxisGroup
      .append("line")
      .attr("x1", yAxisX).attr("y1", mapTop)
      .attr("x2", yAxisX).attr("y2", mapBottom)
      .attr("stroke", axisColor)
      .attr("stroke-width", 1.5);

    // Tick marks
    for (let i = 0; i <= 30; i++) {
      const ty = mapTop + (i / 30) * mapH;
      const tickW = i % 10 === 0 ? 8 : 3;
      yAxisGroup
        .append("line")
        .attr("x1", yAxisX).attr("y1", ty)
        .attr("x2", yAxisX - tickW).attr("y2", ty)
        .attr("stroke", axisColor)
        .attr("stroke-width", i % 10 === 0 ? 1.2 : 0.6);
    }

    // Maturity labels: top of SVG = small y = basic research, bottom = commercial
    const yLabels = [
      { text: "基础", pos: 0.15 },
      { text: "应用", pos: 0.5 },
      { text: "商业化", pos: 0.85 },
    ];
    yLabels.forEach((label) => {
      const ly = mapTop + label.pos * mapH;
      // Horizontal dash
      yAxisGroup
        .append("line")
        .attr("x1", yAxisX - 10).attr("y1", ly)
        .attr("x2", yAxisX).attr("y2", ly)
        .attr("stroke", axisLabelColor)
        .attr("stroke-width", 1);
      // Label
      yAxisGroup
        .append("text")
        .attr("x", yAxisX - 14)
        .attr("y", ly + 4)
        .attr("text-anchor", "end")
        .attr("fill", axisLabelColor)
        .attr("font-size", "12px")
        .attr("font-weight", "600")
        .text(label.text);
    });

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
