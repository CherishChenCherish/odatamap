"use client";

import { useParams } from "next/navigation";
import { getDirection } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { AIAssistant } from "@/components/ai-assistant";

const maturityLabels = {
  emerging: { text: "新兴领域", color: "text-blue-400" },
  growing: { text: "快速增长", color: "text-emerald-400" },
  mature: { text: "成熟领域", color: "text-amber-400" },
  declining: { text: "趋于饱和", color: "text-red-400" },
};

export default function DirectionPage() {
  const { field } = useParams<{ field: string }>();
  const direction = getDirection(field);

  if (!direction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold">未找到该研究方向</h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground mt-2 inline-block"
          >
            ← 返回地图
          </Link>
        </div>
      </div>
    );
  }

  const maturity = maturityLabels[direction.maturity];
  const maxPapers = Math.max(...direction.timeline.map((t) => t.papers));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← 返回地图
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-muted-foreground">研究方向分析</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{direction.name}</h1>
            <Badge variant="outline" className={maturity.color}>
              {maturity.text}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{direction.nameEn}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {direction.description}
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="py-3 text-center">
              <div className="text-xl font-bold font-mono">
                {direction.stats.totalPapers.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                总论文数
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 text-center">
              <div className="text-xl font-bold font-mono">
                {direction.stats.totalScholars.toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                活跃学者
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 text-center">
              <div className="text-xl font-bold font-mono text-emerald-400">
                +{direction.stats.yearlyGrowth}%
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                年增长率
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-3 text-center">
              <div className="text-xl font-bold font-mono">
                {direction.stats.avgCitationsPerPaper}
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                篇均引用
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">发表趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {direction.timeline.map((t) => (
                <div
                  key={t.year}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {t.papers > 1000
                      ? `${(t.papers / 1000).toFixed(1)}k`
                      : t.papers}
                  </span>
                  <div
                    className="w-full bg-primary/60 rounded-t-sm transition-all"
                    style={{
                      height: `${(t.papers / maxPapers) * 100}%`,
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {t.year.toString().slice(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">领域概述</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {direction.overview}
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Scholars */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">顶尖学者</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {direction.topScholars.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">
                      {i + 1}
                    </span>
                    <span className="text-sm">{s.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs font-mono">
                    h={s.hIndex}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Papers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">高影响力论文</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {direction.topPapers.map((p, i) => (
                <div key={p.id} className="py-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground w-4 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug truncate">{p.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {p.year} · {p.citations} 引用
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Related Fields */}
        <div>
          <h3 className="text-sm font-medium mb-2">相关研究方向</h3>
          <div className="flex flex-wrap gap-2">
            {direction.relatedFields.map((rf) => (
              <Badge
                key={rf.id}
                variant="outline"
                className="cursor-pointer hover:bg-accent"
              >
                {rf.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Trend Score */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">趋势热度</span>
              <span className="text-sm font-mono font-bold">
                {direction.trendScore}/100
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                style={{ width: `${direction.trendScore}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-muted-foreground">冷门</span>
              <span className="text-[10px] text-muted-foreground">热门</span>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* AI Assistant with context */}
      <AIAssistant />
    </div>
  );
}
