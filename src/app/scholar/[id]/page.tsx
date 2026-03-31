import { getAuthorById } from "@/lib/openalex";
import { getScholar, getAllScholars } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllScholars().map((s) => ({ id: s.id }));
}

export default async function ScholarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mockScholar = getScholar(id);

  // Normalize data shape
  let scholar: {
    name: string;
    institution: string;
    country: string;
    hIndex: number;
    papers: number;
    citations: number;
    fields: { name: string; count?: number; percentage?: number; color?: string }[];
    recentPapers: { id: string; title: string; year: number; citations: number }[];
    bio?: string;
    isReal?: boolean;
  };

  if (mockScholar) {
    scholar = {
      ...mockScholar,
      fields: mockScholar.fields.map((f) => ({ ...f })),
      isReal: false,
    };
  } else {
    const realAuthor = await getAuthorById(id);
    if (!realAuthor) notFound();
    scholar = {
      name: realAuthor.name,
      institution: realAuthor.institution,
      country: realAuthor.country,
      hIndex: realAuthor.hIndex,
      papers: realAuthor.papers,
      citations: realAuthor.citations,
      fields: realAuthor.topFields.map((f) => ({
        name: f.name,
        count: f.count,
      })),
      recentPapers: realAuthor.recentPapers,
      isReal: true,
    };
  }

  const maxFieldCount = Math.max(
    ...scholar.fields.map((f) => f.count || f.percentage || 1)
  );

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
          <span className="text-sm text-muted-foreground">学者主页</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shrink-0">
            {scholar.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{scholar.name}</h1>
            <p className="text-sm mt-1">{scholar.institution}</p>
            <p className="text-xs text-muted-foreground">{scholar.country}</p>
            {scholar.isReal && (
              <Badge variant="outline" className="mt-1 text-[10px]">
                OpenAlex 数据
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold font-mono">
                {scholar.hIndex}
              </div>
              <div className="text-xs text-muted-foreground mt-1">H-Index</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold font-mono">
                {scholar.papers.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">论文数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <div className="text-2xl font-bold font-mono">
                {scholar.citations.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">总引用</div>
            </CardContent>
          </Card>
        </div>

        {scholar.bio && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">简介</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {scholar.bio}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base">研究领域</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scholar.fields.slice(0, 8).map((field) => {
              const value = field.count || field.percentage || 0;
              const pct = field.percentage || (value / maxFieldCount) * 100;
              return (
                <div key={field.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="truncate mr-2">{field.name}</span>
                    <span className="text-muted-foreground font-mono text-xs shrink-0">
                      {field.count ? `${field.count} 篇` : `${field.percentage}%`}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/60 transition-all"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Separator />

        <div>
          <h3 className="text-base font-medium mb-3">近期论文</h3>
          <div className="space-y-2">
            {scholar.recentPapers.map((paper) => (
              <Link key={paper.id} href={`/paper/${paper.id}`}>
                <Card className="hover:bg-accent/30 transition-colors cursor-pointer">
                  <CardContent className="py-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {paper.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {paper.year} · 引用 {paper.citations}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 ml-3">
                      {paper.citations} 引用
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
