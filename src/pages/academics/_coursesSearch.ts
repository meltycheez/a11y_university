// Course search matching, kept separate so it can be unit-tested without rendering.
export interface Criteria { q: string; subject: string; term: string; levels: string[]; credits: number[] }

interface Searchable {
  code: string; title: string; subjectName: string; description: string; level: string; credits: number; terms: string[];
  sections: { instructor: string }[];
}

const words = (s: string) => s.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

/** Every keyword token must start a word in the code, title, subject, instructors or description ("CS 101", "intro prog"). */
export function matches(c: Searchable, k: Criteria) {
  if (k.subject !== "all" && c.subjectName !== k.subject) return false;
  if (k.term !== "all" && !c.terms.includes(k.term)) return false;
  if (k.levels.length && !k.levels.includes(c.level)) return false;
  if (k.credits.length && !k.credits.includes(c.credits)) return false;
  const tokens = words(k.q);
  if (!tokens.length) return true;
  const hay = words([c.code, c.title, c.subjectName, c.description, ...c.sections.map((s) => s.instructor)].join(" "));
  return tokens.every((t) => hay.some((w) => w.startsWith(t)));
}
