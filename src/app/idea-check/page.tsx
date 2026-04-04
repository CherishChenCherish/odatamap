"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface IdeaResult {
  summary: string;
  scores: {
    novelty: { score: number; label: string; reason: string };
    feasibility: { score: number; label: string; reason: string };
    impact: { score: number; label: string; reason: string };
    saturation: { score: number; label: string; reason: string };
  };
  overall_verdict: string;
  competing_work: { title: string; threat: string; detail: string }[];
  risks: string[];
  optimization_paths: { direction: string; detail: string; difficulty: string }[];
  suggested_keywords: string[];
  recommended_journals: string[];
  timeline_estimate: string;
  one_line_advice: string;
  error?: string;
  raw?: string;
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${score}%`, backgroundColor: color }}
      />
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 70) return "#10b981";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function getVerdictStyle(verdict: string) {
  if (verdict.includes("值得")) return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" };
  if (verdict.includes("调整")) return { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" };
  return { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" };
}

function getThreatColor(threat: string) {
  if (threat === "高") return "text-red-400";
  if (threat === "中") return "text-amber-400";
  return "text-emerald-400";
}

function getDifficultyColor(d: string) {
  if (d === "高") return "border-red-500/50 text-red-400";
  if (d === "中") return "border-amber-500/50 text-amber-400";
  return "border-emerald-500/50 text-emerald-400";
}

export default function IdeaCheckPage() {
  const [idea, setIdea] = useState("");
  const [field, setField] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdeaResult | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || loading) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/idea-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: idea.trim(), field: field.trim() || undefined }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: String(e) } as IdeaResult);
    } finally {
      setLoading(false);
    }
  };

  const exampleIdeas = [
    "利用单细胞转录组学+深度学习预测乳腺癌复发风险",
    "基于大语言模型的自动化科研文献综述生成系统",
    "用CRISPR-Cas13靶向降解阿尔茨海默症相关tau蛋白mRNA",
    "基于量子退火算法优化大规模物流路径规划",
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← 返回地图
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">研究想法评估</span>
          <Badge variant="secondary" className="text-[10px]">AI Powered</Badge>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Idea Check</h1>
          <p className="text-sm text-muted-foreground mt-1">
            输入你的研究想法，AI 帮你评估新颖性、可行性、竞争格局，并提供优化建议。
          </p>
        </div>

        {/* Input Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">你的研究想法 *</label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="例如：利用单细胞转录组学+深度学习预测乳腺癌复发风险..."
                  rows={4}
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">所属领域（可选）</label>
                <input
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  placeholder="例如：计算生物学、量子计算、NLP..."
                  className="w-full bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <Button type="submit" disabled={loading || !idea.trim()} className="w-full">
                {loading ? "AI 评估中..." : "开始评估"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Example Ideas */}
        {!result && !loading && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">试试这些例子：</p>
            <div className="space-y-1.5">
              {exampleIdeas.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setIdea(ex)}
                  className="block w-full text-left text-xs px-3 py-2 rounded-md border border-border/50 hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-pulse space-y-3">
                <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-violet-600 animate-spin" />
                <p className="text-sm text-muted-foreground">AI 正在分析你的研究想法...</p>
                <p className="text-xs text-muted-foreground">评估新颖性、可行性、竞争格局、优化路径</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {result?.error && !result.scores && (
          <Card>
            <CardContent className="py-6">
              <p className="text-sm text-red-400">评估失败：{result.error}</p>
              {result.raw && (
                <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap">{result.raw}</pre>
              )}
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {result?.scores && (
          <div className="space-y-4">
            {/* Verdict */}
            {(() => {
              const style = getVerdictStyle(result.overall_verdict);
              return (
                <Card className={`${style.bg} ${style.border} border`}>
                  <CardContent className="py-4 text-center">
                    <p className={`text-lg font-bold ${style.text}`}>{result.overall_verdict}</p>
                    <p className="text-sm text-muted-foreground mt-1">{result.summary}</p>
                  </CardContent>
                </Card>
              );
            })()}

            {/* Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">评分卡</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.scores).map(([key, val]) => {
                  const labels: Record<string, string> = {
                    novelty: "新颖性",
                    feasibility: "可行性",
                    impact: "影响力",
                    saturation: "领域饱和度",
                  };
                  const isSaturation = key === "saturation";
                  const color = isSaturation
                    ? getScoreColor(100 - val.score)
                    : getScoreColor(val.score);
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{labels[key]}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{val.label}</Badge>
                          <span className="text-sm font-mono font-bold" style={{ color }}>{val.score}</span>
                        </div>
                      </div>
                      <ScoreBar score={val.score} color={color} />
                      <p className="text-xs text-muted-foreground mt-1">{val.reason}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Competing Work */}
            {result.competing_work?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">竞争研究</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.competing_work.map((c, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Badge variant="outline" className={`text-[10px] shrink-0 mt-0.5 ${getThreatColor(c.threat)}`}>
                        威胁{c.threat}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Risks */}
            {result.risks?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">风险提示</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {result.risks.map((r, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-red-400 shrink-0">!</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Optimization Paths */}
            {result.optimization_paths?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">优化路径</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.optimization_paths.map((p, i) => (
                    <div key={i} className="border border-border/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{p.direction}</span>
                        <Badge variant="outline" className={`text-[10px] ${getDifficultyColor(p.difficulty)}`}>
                          难度{p.difficulty}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.detail}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card>
                <CardContent className="py-3 text-center">
                  <p className="text-xs text-muted-foreground">预估周期</p>
                  <p className="text-sm font-medium mt-1">{result.timeline_estimate}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-3 text-center">
                  <p className="text-xs text-muted-foreground">推荐期刊</p>
                  <p className="text-sm font-medium mt-1">{result.recommended_journals?.join("、") || "—"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-3 text-center">
                  <p className="text-xs text-muted-foreground">关键词</p>
                  <div className="flex flex-wrap gap-1 mt-1 justify-center">
                    {result.suggested_keywords?.map((k) => (
                      <Badge key={k} variant="secondary" className="text-[10px]">{k}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* One Line Advice */}
            {result.one_line_advice && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">给你的建议</p>
                  <p className="text-sm font-medium">{result.one_line_advice}</p>
                </CardContent>
              </Card>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => { setResult(null); setIdea(""); }}>
                评估新想法
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="secondary" className="w-full">
                  在地图中探索
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
