import { getPaperById } from "@/lib/openalex";
import { getPaper, getAllPapers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

// Keep mock papers as static params for SSG
export function generateStaticParams() {
  return getAllPapers().map((p) => ({ id: p.id }));
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Try mock data first (for static pages), then OpenAlex
  const mockPaper = getPaper(id);
  let paper: {
    title: string;
    authors: { id: string; name: string; institution: string }[];
    journal: string;
    year: number;
    citations: number;
    doi: string | null;
    abstract: string;
    keywords: string[];
    topics?: string[];
  };

  if (mockPaper) {
    paper = mockPaper;
  } else {
    // Fetch from OpenAlex (for dynamic IDs like W1234567890)
    const realPaper = await getPaperById(id);
    if (!realPaper) notFound();
    paper = realPaper;
  }

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
          <span className="text-sm text-muted-foreground">论文详情</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold leading-tight">{paper.title}</h1>
          <div className="flex gap-2 mt-3">
            {paper.doi && (
              <a
                href={paper.doi.startsWith("http") ? paper.doi : `https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                阅读原文 ↗
              </a>
            )}
            <a
              href={`https://openalex.org/works/${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-accent transition-colors"
            >
              OpenAlex ↗
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {paper.authors.map((author) => (
            <Link key={author.id} href={`/scholar/${author.id}`}>
              <Badge
                variant="secondary"
                className="hover:bg-accent cursor-pointer"
              >
                {author.name}
                <span className="text-muted-foreground ml-1 font-normal">
                  {author.institution}
                </span>
              </Badge>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">期刊</span>
            <span className="font-medium">{paper.journal}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">年份</span>
            <span className="font-mono">{paper.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">引用</span>
            <span className="font-mono font-medium">{paper.citations}</span>
          </div>
          {paper.doi && (
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground">DOI</span>
              <span className="font-mono text-xs">{paper.doi}</span>
            </div>
          )}
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">摘要</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {paper.abstract}
            </p>
          </CardContent>
        </Card>

        {paper.keywords.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">关键词</h3>
            <div className="flex flex-wrap gap-1.5">
              {paper.keywords.map((kw) => (
                <Badge key={kw} variant="outline" className="text-xs">
                  {kw}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {"topics" in paper && paper.topics && paper.topics.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">研究主题</h3>
            <div className="flex flex-wrap gap-1.5">
              {paper.topics.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">数据来源</p>
                <p className="font-medium text-sm">
                  {mockPaper ? "科研数据地图" : "OpenAlex"}
                </p>
              </div>
              <Link href="/">
                <Badge className="cursor-pointer">在地图中查看</Badge>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
