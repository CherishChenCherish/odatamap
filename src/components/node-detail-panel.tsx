"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { ResearchNode, Continent } from "@/lib/map-data";

interface NodeDetailPanelProps {
  node?: ResearchNode | null;
  continent?: Continent | null;
  onClose: () => void;
}

export function NodeDetailPanel({
  node,
  continent,
  onClose,
}: NodeDetailPanelProps) {
  if (!node && !continent) return null;

  return (
    <div className="absolute right-0 top-0 h-full w-80 z-40 p-4 pointer-events-none">
      <Card className="pointer-events-auto h-full bg-card/95 backdrop-blur-md border-border/50 shadow-2xl overflow-auto">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">
                {node ? node.name : continent?.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {node ? node.nameEn : continent?.nameEn}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-7 w-7 p-0 text-muted-foreground"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {node && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold font-mono">
                    {node.papers.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    相关论文
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold font-mono">
                    {node.scholars.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    活跃学者
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">研究密度</h4>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-3 flex-1 rounded-sm"
                      style={{
                        backgroundColor:
                          i < node.size ? node.color : "rgba(255,255,255,0.1)",
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {node.size >= 4
                    ? "高密度：竞争激烈，技术较成熟"
                    : node.size >= 3
                      ? "中等密度：活跃发展中"
                      : "低密度：蓝海领域，突破潜力大"}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">位置解读</h4>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p>
                    横轴位置：
                    {node.x < 0.3
                      ? "微观尺度研究"
                      : node.x < 0.6
                        ? "中观尺度研究"
                        : "宏观尺度研究"}
                  </p>
                  <p>
                    纵轴位置：
                    {node.y < 0.4
                      ? "偏基础研究，距商业化较远"
                      : node.y < 0.7
                        ? "应用研究阶段"
                        : "接近商业化落地"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-2">AI 建议</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {node.size <= 2
                    ? `「${node.name}」目前研究者较少，属于蓝海领域。如果你有相关背景，这里可能存在重大突破机会，但同时也意味着更高的不确定性和更长的探索周期。`
                    : node.size >= 4
                      ? `「${node.name}」是当前热门研究方向，竞争激烈。建议寻找细分交叉领域，或者关注该领域与其他大陆（如${node.x < 0.5 ? "工程技术" : "生命健康"}）的交叉点。`
                      : `「${node.name}」处于活跃发展阶段，既有一定研究基础，又不过度拥挤。是进入该领域的较好时机。`}
                </p>
              </div>

              <Badge
                variant="outline"
                className="w-full justify-center py-1.5 text-xs"
                style={{ borderColor: node.color, color: node.color }}
              >
                {
                  [
                    "物质与微观",
                    "生命与健康",
                    "数学与智能",
                    "工程技术",
                    "地球与环境",
                    "宇宙",
                    "社会与人文",
                  ].find(
                    (_, i) =>
                      [
                        "matter",
                        "life",
                        "math",
                        "engineering",
                        "earth",
                        "universe",
                        "society",
                      ][i] === node.continent
                  )
                }
              </Badge>
            </>
          )}

          {continent && !node && (
            <>
              <p className="text-sm text-muted-foreground">
                {continent.description}
              </p>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">
                  包含 {continent.nodes.length} 个研究方向
                </h4>
                <div className="space-y-1">
                  {continent.nodes
                    .sort((a, b) => b.papers - a.papers)
                    .map((n) => (
                      <div
                        key={n.id}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <span>{n.name}</span>
                        <span className="text-muted-foreground font-mono">
                          {n.papers.toLocaleString()} 篇
                        </span>
                      </div>
                    ))}
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold font-mono">
                    {continent.nodes
                      .reduce((s, n) => s + n.papers, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    总论文数
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <div className="text-xl font-bold font-mono">
                    {continent.nodes
                      .reduce((s, n) => s + n.scholars, 0)
                      .toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    总学者数
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
