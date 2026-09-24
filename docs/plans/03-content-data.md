# Plan 03 — Content & Data

## Goal

Create a believable, deterministic body of fictional university content with no Lorem Ipsum. It's stored as committed JSON and TypeScript, and it's searchable in the browser.

## Brand (`src/data/brand.ts`)

| Item | Value (placeholder) |
|---|---|
| Name | Redwood State University (RSU) |
| Founded | 1911, as Arcadia Falls Normal School |
| Location | 1400 Canopy Drive, Arcadia Falls, CA 95579 (fictional city) |
| Colors | Redwood `#7A2E1F`, Fern `#2F5D3A`, Mist `#E8EEF0`, Gold accent `#C9A227` |
| Typefaces | Source Serif 4 for headings, Source Sans 3 for body (self-hosted, no CDN) |
| Mascot | Rowan the Redwood Owl (teams: Redwood Owls) |
| Motto | *Radices altae, rami lati* ("Deep roots, wide branches") |
| Phone / email | Use the 555-01xx range and the `example.edu` domain |

Before content is written, check the name, city, and domain against real institutions. Rename if there's a clash. The brand lives in one file, so a rename is easy.

## Datasets

**Hand-written flagship content** (`src/data/content/*.json` or `*.ts`), for pages that must read well:

- About, mission, history timeline, leadership (6 people), accreditation, and the strategic plan (4 pillars).
- Admissions pages, the tuition table, scholarships, the financial aid explainer, and the FAQ (about 25 questions and answers).
- 6 colleges and 10 departments, each with an overview, highlights, and contacts.
- 10–12 degree programs, each with requirements, outcomes, sample courses, and careers.
- 12–15 news articles (500–900 words each), with categories, bylines, dates, and related links.
- 8–10 events, each with a description, location, capacity, and registration options.
- Student services pages: housing, dining, health, counseling, parking, transit, safety, recreation, and orgs.
- Library pages, research guides, database descriptions, and policies.
- Giving priorities and campaigns, plus HR, benefits, and payroll copy.

**Generated bulk data** (`scripts/generate-data.ts` writes `src/data/generated/*.json`, which is committed):

| Dataset | Count | Notes |
|---|---|---|
| Courses | ~300 | Subject, number, title, credits, semester(s), instructor, days/times, seats, prerequisites, description built from templates |
| Faculty | ~30 with profiles, ~150 in the staff directory | Names come from a curated pool of diverse, plausible names. Research interests, publications, office, and hours. |
| Student organizations | ~40 | Name, category, meeting time |
| Athletics | 6 teams, schedules, results, rosters (~15 per team), 8 athlete profiles | |
| Jobs | ~20 postings | |
| Library databases | ~40 | |
| Portal student | 1 student with a schedule, grades, degree audit, account ledger, holds, to-dos, and messages | |

**Determinism rules**

- The generator uses a seeded PRNG (mulberry32 with `SEED = 20260924`). Its output is **committed**, so builds never regenerate data and git diffs show exactly what changed.
- There's no `Math.random()` or `Date.now()` at render time. The "current date" is fixed, for example `SITE_NOW = 2026-10-05`, so calendars, "upcoming events," and the portal render the same way on every load.
- IDs and slugs stay stable.

## Writing approach

- Write the copy with Claude directly into the JSON and TypeScript files, working section by section in batches.
- Keep the tone of a real public university: some pages polished, some stale (for example "Updated Spring 2019"), and some full of jargon. This matches the "many departments" feel.
- Put realistic defect raw material inside the content, such as PDF links ("2025–26 Tuition Schedule (PDF)"), generic "Read more" links, and long tables. That gives plan 07 natural places to put defects.
- Include content hooks for defects in the data model. For example, each image reference points to a manifest ID that carries both good and bad alt variants (plan 04).

## Fake documents

`public/documents/` holds about 10 small fake PDFs (tuition schedule, catalog addendum, parking map, policies), generated with a script. They're the targets for "links to documents" alerts.

## Search (`src/search/`)

- `scripts/build-search-index.ts` runs before `build` and walks the inventory plus the datasets. It writes `public/search-index.json` with entries of `{id, type, title, url, text, tags}`. Types are page, department, program, faculty, course, news, and event.
- The client lazily loads the index with MiniSearch, using field boosts (title over tags over text) and prefix and fuzzy matching.
- `/search?q=computer science` returns results grouped by type: the CS department, BS and MS CS, faculty, courses, and news.
- Result filtering and the search state are in memory only.

## Tasks

1. Finalize the brand and check the name for clashes.
2. Define TypeScript types for every dataset in `src/data/types.ts`.
3. Write the generator, run it, and commit the output.
4. Write the flagship content in section batches.
5. Generate the fake PDFs.
6. Build the search index script and the search client.

## Acceptance criteria

- `npm run gen:data` is idempotent: rerunning it produces a byte-identical git diff.
- Nothing in the UI shows Lorem Ipsum, and every page has believable copy.
- Searching "computer science" returns the six result groups the PRD lists.
- Two builds produce identical HTML for the same route.

## Implementation notes (2026-09-24)

- Built by three parallel agents with split file ownership after the shared slugs were fixed in `catalog.ts` (ADR-011).
- Hand-written copy (`src/data/content/`): 91 static pages (`pages*.ts`), 6 colleges / 10 departments / 12 programs (`academics.ts`), 15 news articles of 540–694 words (`news.ts`), 10 events (`events.ts`), 30 faculty profiles and 6 leadership bios (`people.ts`).
- Generated (`src/data/generated/`, `npm run gen:data`, byte-identical on rerun): 304 courses / 662 sections, 149-person directory, 40 orgs, 21 jobs, 41 databases, athletics for 6 teams plus 8 athlete profiles, and the portal student.
- 16 fake PDFs in `public/documents/` (`npm run gen:docs`). Every `/documents/*.pdf` link in the content resolves.
- Search: `public/search-index.json` (about 505 entries) is rebuilt by `npm run build`; "computer science" returns department, program, faculty, course, news and page groups (`src/search/search.test.ts`).
- Verified: two consecutive builds produce identical `build/client`; no Lorem Ipsum anywhere.
- Thin pages (summary plus one section, real content comes with their interactive feature): portal, news/events/library search, athletics schedule/scores, apply, request-info, donate, directory, jobs.
- All names fictionalized per ADR-021 and `docs/WORLD.md` (ZIP 95579).
