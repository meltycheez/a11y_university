// Browser site search: lazily loads public/search-index.json (built by scripts/build-search-index.ts) into MiniSearch.
import type MiniSearch from "minisearch";

export type SearchType = "department" | "program" | "faculty" | "course" | "news" | "event" | "page";

export interface SearchDoc {
  id: string;
  type: SearchType;
  title: string;
  url: string;
  text: string;
  tags: string[];
}

export type SearchResult = Omit<SearchDoc, "tags"> & { score: number };

/** Display order and group headings on the results page. */
export const typeLabels: Record<SearchType, string> = {
  department: "Departments", program: "Degree programs", faculty: "Faculty", course: "Courses",
  news: "News", event: "Events", page: "Pages",
};

let index: Promise<MiniSearch<SearchDoc>> | undefined;

function loadIndex() {
  index ??= Promise.all([
    import("minisearch"),
    fetch(`${import.meta.env.BASE_URL}search-index.json`).then((r) => {
      if (!r.ok) throw new Error(`search index: HTTP ${r.status}`);
      return r.json() as Promise<SearchDoc[]>;
    }),
  ]).then(([{ default: MiniSearch }, docs]) => {
    const ms = new MiniSearch<SearchDoc>({
      fields: ["title", "tags", "text"],
      storeFields: ["type", "title", "url", "text"],
      searchOptions: { boost: { title: 3, tags: 2 }, prefix: true, fuzzy: 0.2, combineWith: "AND" },
    });
    ms.addAll(docs);
    return ms;
  });
  index.catch(() => { index = undefined; });
  return index;
}

export async function search(query: string): Promise<SearchResult[]> {
  const ms = await loadIndex();
  return ms.search(query) as unknown as SearchResult[];
}

/** Header box suggestions: the best matches for what's been typed so far. */
export async function suggest(prefix: string, limit = 6): Promise<SearchResult[]> {
  return (await search(prefix)).slice(0, limit);
}

/** "Did you mean": corrects each word to the index term its fuzzy matches favor; null when nothing changes. */
export async function didYouMean(query: string): Promise<string | null> {
  const ms = await loadIndex();
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const fixed = words.map((w) => {
    if (w.length < 4 || ms.autoSuggest(w, { prefix: true, fuzzy: 0 }).length) return w; // a known word or the start of one
    const votes = new Map<string, number>();
    for (const s of ms.autoSuggest(w, { prefix: false, fuzzy: 0.3 })) for (const t of s.terms) votes.set(t, (votes.get(t) ?? 0) + s.score);
    return [...votes].sort((a, b) => b[1] - a[1])[0]?.[0] ?? w;
  });
  const out = fixed.join(" ");
  return out !== words.join(" ") ? out : null;
}
