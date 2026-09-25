# Plan 05 — Site Sections & Route Inventory

## Goal

Build every public route using shared templates plus data, with enough variation in layout, components, and content that no two sections feel generated from a single template.

**Defect tier** (drives plan 07): **L** light (2–3 issues), **M** typical (5–12), **H** heavy (15–25), **T** terrible legacy (30+), **A** accessible by default.

## Route inventory

### University (10)
| Route | Template / notes | Tier |
|---|---|---|
| `/` | Homepage: hero carousel, news, events, audience paths, stats | H |
| `/about` | Overview + facts | L |
| `/about/leadership` | Leadership cards + bios in modals | M |
| `/about/mission` | Long-form | L |
| `/about/history` | Timeline | M |
| `/about/accreditation` | Text + document links | M |
| `/about/strategic-plan` | Tabs for the four pillars | M |
| `/campus-map` | Interactive SVG map | **T** |
| `/contact` | Contact form + departments table | M |
| `/search` | Global search results | M |

### Admissions & Aid (16)
| Route | Notes | Tier |
|---|---|---|
| `/admissions` | Newer marketing landing page | M |
| `/admissions/undergraduate` · `/graduate` · `/international` · `/transfer` | Audience landing template ×4 | L–M |
| `/admissions/freshman-requirements` | Checklist + table | M |
| `/admissions/process` | Stepper | M |
| `/admissions/apply` | Multi-step application (plan 06) | H |
| `/admissions/tuition` | Cost tables | M |
| `/admissions/scholarships` | Filterable list | M |
| `/admissions/request-info` | Form | M |
| `/admissions/visit` | Date picker + modal | H |
| `/admissions/faq` | Accordion | M |
| `/financial-aid` | Explainer | M |
| `/financial-aid/types` | Grants, loans, and work-study tables | M |
| `/financial-aid/legacy-application` | **Legacy Financial Aid Form** | **T** |

### Academics (35)
| Route | Notes | Tier |
|---|---|---|
| `/academics` | Hub | L |
| `/academics/colleges/:slug` ×6 | engineering, business, arts-humanities, science, education, health-sciences | L–M |
| `/academics/departments/:slug` ×10 | computer-science, mathematics, biology, chemistry, english, history, psychology, nursing, mechanical-engineering, business-administration (older CMS template) | M |
| `/academics/programs` | Program finder with filters | M |
| `/academics/programs/:slug` ×12 | BS CS, MS CS, BS Math, BS Biology, BS Chemistry, BA English, BA History, BA Psychology, BSN Nursing, BS Mech E, BBA, MBA | L–M |
| `/academics/minors` · `/certificates` | Lists | L |
| `/academics/catalog` | **Old Course Catalog** | **T** |
| `/academics/courses` | Course search (plan 06) | H |
| `/academics/calendar` | Academic calendar tables | M |

### Faculty (1 + ~30)
| `/faculty` | Directory with search and filters (plan 06) | H |
|---|---|---|
| `/faculty/:slug` ×~30 | Profile: bio, research, publications, office | L–M (varied) |

### Students (13)
`/students`, `/students/registrar`, `/students/advising`, `/students/careers`, `/students/counseling`, `/students/health`, `/students/housing`, `/students/dining`, `/students/parking`, `/students/transportation`, `/students/safety`, `/students/organizations` (filterable), `/students/recreation`. These are services templates with varied components: hours tables, tabs, accordions, and maps. Tiers range from L to M, with dining (image-of-text menu) and parking (tables and a PDF map) at H.

### Library (8 + 3)
`/library` (tabbed search box, dense nav, tier H), `/library/search` (results with facets), `/library/databases` (A–Z list, tier H), `/library/guides` and `/library/guides/:slug` ×3, `/library/study-rooms` (booking grid with drag, tier H), `/library/hours` (calendar table), `/library/policies`, `/library/account` (account-style interface).

### News (4 + ~19)
`/news` (magazine front), `/news/archive` (paginated), `/news/search`, `/news/category/:slug` ×4 (research, campus, athletics, alumni), and `/news/:slug` ×15 (article template with related stories).

### Events (3 + ~14)
`/events` (month calendar grid, tier H), `/events/search`, `/events/category/:slug` ×4, and `/events/:slug` ×10 (detail + registration, plan 06).

### Athletics (4 + ~14)
`/athletics` (score ticker, tier H), `/athletics/teams`, `/athletics/schedule` (**Athletics Schedule, tier T**), `/athletics/scores`, `/athletics/teams/:sport` ×6 (with roster table), and `/athletics/athletes/:slug` ×8.

### Giving (6)
`/giving`, `/giving/donate` (**Donation Form, tier T**), `/giving/priorities`, `/giving/alumni`, `/giving/scholarships`, `/giving/campaigns`.

### Employees (7)
`/employees`, `/employees/hr`, `/employees/benefits` (comparison tables), `/employees/jobs` (filterable postings), `/employees/policies` (PDF-heavy), `/employees/payroll`, `/employees/directory` (searchable table).

### Student Portal (10)
`/portal` (dashboard), `/portal/schedule`, `/portal/grades`, `/portal/degree-progress`, `/portal/account`, `/portal/registration` (**Student Registration SPA, tier T**), `/portal/holds`, `/portal/todo`, `/portal/messages`, `/portal/profile`. A fake "Signed in as Jordan Alvarez" header; no real auth.

### Audience & utility (8)
`/alumni`, `/parents`, `/visitors`, `/faculty-staff`, `/accessibility` (the university's own accessibility statement; tier L, which is ironic but realistic), `/policies/privacy`, `/sitemap`, and a 404 page.

### Accessibility Lab (8, tier A for the index)
`/accessibility-lab` plus `/errors`, `/alerts`, `/manual`, `/forms`, `/keyboard`, `/tables`, `/aria` (plan 08).

**Totals:** about **115 distinct hand-designed pages and template pages**, plus about **80 data-driven detail pages**, for roughly 195 prerendered routes. If you want the count closer to the PRD's ~100, cut the detail instances (fewer faculty profiles and articles). No hand-designed pages need to be removed.

## Templates (reused with variation)

`AudienceLanding`, `CollegeLanding`, `DepartmentPage` (older CMS), `ProgramPage`, `ServicePage`, `ArticlePage`, `EventPage`, `TeamPage`, `ProfilePage` (faculty and athletes, with themes), `ListingPage` (filters + pagination), `LongFormPage`, and `PortalPage`.

To avoid a sameness problem, every template must use **at least two optional content blocks** from a block library. Blocks: stats band, quote, tabs, accordion, gallery, video embed (iframe, which supports the frame-title scenario), card grid, data table, callout, related links, contact card, and CTA band. Each page's data selects its own blocks, so the same template produces different pages.

## Tasks (suggested build order)

1. Global shell pages: home, about set, contact, 404, and sitemap.
2. The block library and templates.
3. Academics (the largest area): colleges, departments, and programs.
4. Admissions and aid, then students, library, news, events, athletics, giving, employees, and audiences.
5. Portal pages (the shell and static views; interactions come in plan 06).
6. Breadcrumbs and "related" links across sections, so the site feels interconnected.

For every page, write its defects at the same time it's built, following the tier and the plan 07 catalog.

## Acceptance criteria

- Every inventory route renders real content, prerenders, and loads directly.
- No orphan pages: every route is reachable from the navigation, the footer, listings, or the sitemap.
- Screenshots of the sections look like one real university's patchwork of sites.

## Implementation notes (2026-09-25)

- Foundation first (ADR-023–025): full rule taxonomy with coverage areas, scenario helpers (`SmartLink`, `IconButton`, `Field`, `Heading`), the block library, the route file convention and one registry file per area. How-to: [05-build-guide.md](05-build-guide.md).
- Built by five parallel agents with split ownership: about/audiences/giving/employees (24 routes, 112 scenarios), admissions/aid/students (27, 124), academics/faculty (64, 38), news/events/library (45, 100), athletics/portal/home (26, 82 incl. the 8 seeds). Every page is within its tier budget.
- Totals: 211 prerendered routes, **456 registered scenarios**. `npm run check:scenarios` confirms each one renders on every page it lists and that no page carries an unregistered marker.
- Verified in Chrome against the static build on 29 sample pages across all sections: no console or hydration errors, Fix All changes the DOM on every page, `lang` is set, and the sections read as one university's patchwork of sites.
- Still stubs, owned by later plans: `/admissions/apply`, `/academics/courses`, `/portal/registration` (plan 06); `/financial-aid/legacy-application`, `/academics/catalog`, `/athletics/schedule`, `/giving/donate`, `/campus-map` (plan 07, with plan 06 for the interactive parts). Static stand-ins wait for plan 06 on `/admissions/visit` (date picker), `/events/:slug` (registration form), `/library/study-rooms` (booking grid), `/faculty` and `/employees/directory` (search and filters), and portal interactions.
- A content consistency pass reconciled the plan 03 sources (people, dates, buildings, money, registration dates, the athletics season) with each other and with `docs/WORLD.md`.
- Known gaps for plan 07: stub pages still render content links and tables through `ContentSection` without scenarios, and a few copy helpers are imported across page folders (`pages/about/_Copy.tsx`, `pages/admissions/_content.tsx`); promote them to `components/` if more sections need them.
