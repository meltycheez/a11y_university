// Builds public/search-index.json from the route inventory, hand-written content, and generated courses.
// Runs before `react-router build`. Content files are optional: missing ones are skipped.
import { readFileSync, writeFileSync } from "node:fs";
import { registerHooks } from "node:module";
import type { Course } from "../src/data/types";
import type { SearchDoc, SearchType } from "../src/search/index";

registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) { if (spec.startsWith(".")) return next(`${spec}.ts`, ctx); throw e; }
  },
});
const { inventory } = await import("../src/routes/inventory");
const { colleges, departments, eventCategories, events, faculty, newsArticles, newsCategories, programs } = await import("../src/data/catalog");
const courses: Course[] = JSON.parse(readFileSync(new URL("../src/data/generated/courses.json", import.meta.url), "utf8"));

async function content(name: string): Promise<Record<string, any>> {
  try {
    return await import(`../src/data/content/${name}.ts`);
  } catch (e: any) {
    if (e?.code !== "ERR_MODULE_NOT_FOUND" || !String(e.message).includes(`${name}.ts`)) console.warn(`search index: skipped ${name}.ts (${e?.message})`);
    return {};
  }
}
const [{ pageContent = {} }, { collegeContent = {}, departmentContent = {}, programContent = {} }, { newsContent = {} }, { eventsContent = {} }, { facultyProfiles = {} }] =
  await Promise.all(["pages", "academics", "news", "events", "people"].map(content));

// Every human-readable string in a content record, skipping ids, links and dates.
const SKIP = /^(image|href|url|slug|date|related|id)$/i;
function strings(v: unknown): string[] {
  if (typeof v === "string") return [v];
  if (Array.isArray(v)) return v.flatMap(strings);
  if (v && typeof v === "object") return Object.entries(v).flatMap(([k, x]) => (SKIP.test(k) ? [] : strings(x)));
  return [];
}
const text = (...parts: unknown[]) => strings(parts).join(" ").replace(/\s+/g, " ").trim();
const nameOf = <T extends { slug: string; name: string }>(xs: T[], slug?: string) => xs.find((x) => x.slug === slug)?.name ?? "";

const docs: SearchDoc[] = [];
const add = (type: SearchType, url: string, title: string, body: string, tags: string[]) =>
  docs.push({ id: `${type}:${url}`, type, title, url, text: body, tags: tags.filter(Boolean) });

for (const e of inventory) {
  if (e.section === "lab" || e.path === "/search") continue;
  const slug = e.path.split("/").at(-1)!;
  switch (e.pattern) {
    case "/academics/departments/:slug": {
      const d = departments.find((x) => x.slug === slug)!;
      add("department", e.path, e.title, text(departmentContent[slug]), ["Department", d.name, nameOf(colleges, d.college)]);
      break;
    }
    case "/academics/programs/:slug": {
      const p = programs.find((x) => x.slug === slug)!;
      add("program", e.path, e.title, text(programContent[slug]), [p.degree, p.level, nameOf(departments, p.department)]);
      break;
    }
    case "/faculty/:slug": {
      const f = faculty.find((x) => x.slug === slug)!;
      const profile = facultyProfiles[slug];
      add("faculty", e.path, e.title, text(f.title, nameOf(departments, f.department), profile?.bio), [nameOf(departments, f.department), ...(profile?.researchInterests ?? [])]);
      break;
    }
    case "/news/:slug": {
      const n = newsContent[slug];
      add("news", e.path, e.title, text(n?.dek, n?.body), ["News", nameOf(newsCategories, newsArticles.find((x) => x.slug === slug)?.category)]);
      break;
    }
    case "/events/:slug": {
      const ev = eventsContent[slug];
      add("event", e.path, e.title, text(ev?.description, ev?.location), ["Event", nameOf(eventCategories, events.find((x) => x.slug === slug)?.category)]);
      break;
    }
    case "/academics/colleges/:slug":
      add("page", e.path, e.title, text(collegeContent[slug]), ["College"]);
      break;
    default:
      add("page", e.path, e.title, text(e.summary, pageContent[e.path]), [e.section]);
  }
}
for (const c of courses) {
  const instructors = [...new Set(c.sections.map((s) => s.instructor))];
  add("course", `/academics/courses?q=${encodeURIComponent(c.code)}`, `${c.code}: ${c.title}`, text(c.description, instructors), [c.subjectName, c.subject, c.level]);
}

const out = new URL("../public/search-index.json", import.meta.url);
writeFileSync(out, `[\n${docs.map((d) => JSON.stringify(d)).join(",\n")}\n]\n`);
console.log(`build:search: ${docs.length} entries → public/search-index.json`);
