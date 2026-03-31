import { getPaper, getAllPapers } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getAllPapers().map((p) => ({ id: p.id }));
}

export default async function PaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const paper = getPaper(id);
  if (!paper) notFound();

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
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold leading-tight">{paper.title}</h1>
          <p className="text-sm text-muted-foreground mt-2">{paper.titleEn}</p>
        </div>

        {/* Authors */}
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

        {/* Meta */}
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
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground">DOI</span>
            <span className="font-mono text-xs">{paper.doi}</span>
          </div>
        </div>

        <Separator />

        {/* Abstract */}
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

        {/* Keywords */}
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

        {/* Field Link */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">所属研究方向</p>
                <p className="font-medium">{paper.field}</p>
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
