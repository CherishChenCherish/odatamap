// OpenAlex API - free, no API key required
// Docs: https://docs.openalex.org/
// Covers 250M+ papers, 90M+ authors, 100K+ institutions

const BASE_URL = "https://api.openalex.org";
const MAILTO = "cherishchen2510@gmail.com"; // polite pool - must be real email

// Unified fetch with proper headers for OpenAlex polite pool
async function oaFetch(url: string): Promise<Response> {
  const separator = url.includes("?") ? "&" : "?";
  const fullUrl = `${url}${separator}mailto=${encodeURIComponent(MAILTO)}`;
  return fetch(fullUrl, {
    headers: {
      "User-Agent": `ODataMap/1.0 (mailto:${MAILTO})`,
      Accept: "application/json",
    },
  });
}

interface OpenAlexWork {
  id: string;
  title: string;
  publication_year: number;
  cited_by_count: number;
  doi: string | null;
  primary_location: {
    source: { display_name: string } | null;
  } | null;
  authorships: {
    author: { id: string; display_name: string };
    institutions: { display_name: string }[];
  }[];
  abstract_inverted_index: Record<string, number[]> | null;
  keywords: { keyword: string }[];
  concepts: { display_name: string; score: number }[];
  topics: { display_name: string; score: number }[];
}

interface OpenAlexAuthor {
  id: string;
  display_name: string;
  works_count: number;
  cited_by_count: number;
  summary_stats: {
    h_index: number;
    i10_index: number;
  };
  affiliations: {
    institution: { display_name: string; country_code: string };
    years: number[];
  }[];
  topics: { display_name: string; count: number }[];
  works_api_url: string;
}

interface OpenAlexResults<T> {
  meta: { count: number; per_page: number; page: number };
  results: T[];
}

// Helper: reconstruct abstract from inverted index
function reconstructAbstract(
  invertedIndex: Record<string, number[]> | null
): string {
  if (!invertedIndex) return "暂无摘要。";
  const words: [string, number][] = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words.push([word, pos]);
    }
  }
  words.sort((a, b) => a[1] - b[1]);
  return words.map((w) => w[0]).join(" ");
}

// Helper: extract OpenAlex ID from URL
function extractId(url: string): string {
  return url.split("/").pop() || url;
}

// Search papers by keyword
export async function searchPapers(
  query: string,
  page = 1,
  perPage = 10
): Promise<{
  total: number;
  papers: {
    id: string;
    title: string;
    year: number;
    citations: number;
    doi: string | null;
    journal: string;
    authors: { id: string; name: string; institution: string }[];
    abstract: string;
    keywords: string[];
  }[];
}> {
  const params = new URLSearchParams({
    search: query,
    page: String(page),
    per_page: String(perPage),
  });

  const res = await oaFetch(`${BASE_URL}/works?${params}`);
  if (!res.ok) throw new Error(`OpenAlex API error: ${res.status}`);

  const data: OpenAlexResults<OpenAlexWork> = await res.json();

  return {
    total: data.meta.count,
    papers: data.results.map((w) => ({
      id: extractId(w.id),
      title: w.title || "无标题",
      year: w.publication_year,
      citations: w.cited_by_count,
      doi: w.doi,
      journal: w.primary_location?.source?.display_name || "未知期刊",
      authors: w.authorships.slice(0, 5).map((a) => ({
        id: extractId(a.author.id),
        name: a.author.display_name,
        institution: a.institutions[0]?.display_name || "未知机构",
      })),
      abstract: reconstructAbstract(w.abstract_inverted_index),
      keywords: [
        ...w.keywords.map((k) => k.keyword),
        ...w.concepts.slice(0, 3).map((c) => c.display_name),
      ].slice(0, 8),
    })),
  };
}

// Get a single paper by OpenAlex ID
export async function getPaperById(id: string) {
  const res = await oaFetch(`${BASE_URL}/works/${id}`);
  if (!res.ok) return null;

  const w: OpenAlexWork = await res.json();
  return {
    id: extractId(w.id),
    title: w.title || "无标题",
    year: w.publication_year,
    citations: w.cited_by_count,
    doi: w.doi,
    journal: w.primary_location?.source?.display_name || "未知期刊",
    authors: w.authorships.slice(0, 10).map((a) => ({
      id: extractId(a.author.id),
      name: a.author.display_name,
      institution: a.institutions[0]?.display_name || "未知机构",
    })),
    abstract: reconstructAbstract(w.abstract_inverted_index),
    keywords: [
      ...w.keywords.map((k) => k.keyword),
      ...w.concepts.slice(0, 5).map((c) => c.display_name),
    ].slice(0, 10),
    topics: w.topics?.slice(0, 5).map((t) => t.display_name) || [],
  };
}

// Search authors
export async function searchAuthors(
  query: string,
  page = 1,
  perPage = 10
): Promise<{
  total: number;
  authors: {
    id: string;
    name: string;
    institution: string;
    country: string;
    hIndex: number;
    papers: number;
    citations: number;
    topFields: string[];
  }[];
}> {
  const params = new URLSearchParams({
    search: query,
    page: String(page),
    per_page: String(perPage),
  });

  const res = await oaFetch(`${BASE_URL}/authors?${params}`);
  if (!res.ok) throw new Error(`OpenAlex API error: ${res.status}`);

  const data: OpenAlexResults<OpenAlexAuthor> = await res.json();

  return {
    total: data.meta.count,
    authors: data.results.map((a) => ({
      id: extractId(a.id),
      name: a.display_name,
      institution:
        a.affiliations[0]?.institution.display_name || "未知机构",
      country: a.affiliations[0]?.institution.country_code || "未知",
      hIndex: a.summary_stats.h_index,
      papers: a.works_count,
      citations: a.cited_by_count,
      topFields: a.topics.slice(0, 5).map((t) => t.display_name),
    })),
  };
}

// Get a single author by OpenAlex ID
export async function getAuthorById(id: string) {
  const res = await oaFetch(`${BASE_URL}/authors/${id}`);
  if (!res.ok) return null;

  const a: OpenAlexAuthor = await res.json();

  // Fetch recent papers
  const worksRes = await oaFetch(
    `${a.works_api_url}&sort=publication_year:desc&per_page=5`
  );
  const worksData: OpenAlexResults<OpenAlexWork> = worksRes.ok
    ? await worksRes.json()
    : { meta: { count: 0, per_page: 0, page: 0 }, results: [] };

  return {
    id: extractId(a.id),
    name: a.display_name,
    institution:
      a.affiliations[0]?.institution.display_name || "未知机构",
    country: a.affiliations[0]?.institution.country_code || "未知",
    hIndex: a.summary_stats.h_index,
    i10Index: a.summary_stats.i10_index,
    papers: a.works_count,
    citations: a.cited_by_count,
    topFields: a.topics.slice(0, 8).map((t) => ({
      name: t.display_name,
      count: t.count,
    })),
    recentPapers: worksData.results.map((w) => ({
      id: extractId(w.id),
      title: w.title || "无标题",
      year: w.publication_year,
      citations: w.cited_by_count,
    })),
  };
}

// Get trending topics/concepts for a research field
export async function getFieldStats(fieldName: string) {
  const params = new URLSearchParams({
    search: fieldName,
    per_page: "1",
  });

  const res = await oaFetch(`${BASE_URL}/topics?${params}`);
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.results?.length) return null;

  const topic = data.results[0];
  return {
    id: extractId(topic.id),
    name: topic.display_name,
    worksCount: topic.works_count,
    citedByCount: topic.cited_by_count,
    description: topic.description || "",
    siblings: topic.siblings?.slice(0, 5).map((s: { display_name: string }) => s.display_name) || [],
  };
}
