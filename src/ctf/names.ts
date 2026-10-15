// Plan 14 §5e: keeps obviously offensive names off the shared leaderboard. A short built-in list, not a full filter:
// names already in the sheet (or posted to it directly) are deleted there by hand.

/** Matched anywhere in the name once spaces and symbols are gone: long enough not to hit real names. */
const ANYWHERE = [
  "fuck", "shit", "bitch", "asshole", "bastard", "pussy", "penis", "vagina", "dildo", "whore", "slut",
  "nigger", "nigga", "faggot", "retard", "tranny", "kike", "wank", "jizz", "porn", "hitler", "nazi",
];
/** Matched only as a whole word, so "Cassidy", "Hancock", "Sussex" and "Scunthorpe" still work. */
const WHOLE_WORD = ["cunt", "cunts", "ass", "fag", "cum", "tit", "tits", "dick", "cock", "rape", "sex", "spic", "chink", "twat", "coon"];

// ponytail: simple character swaps only; a determined player can still get past it (the board is honor-system).
const LEET: Record<string, string> = { "0": "o", "1": "i", "!": "i", "3": "e", "4": "a", "@": "a", "5": "s", "$": "s", "7": "t" };

export function isBlockedName(name: string): boolean {
  const plain = [...name.toLowerCase()].map((ch) => LEET[ch] ?? ch).join("");
  const squashed = plain.replace(/[^a-z]/g, "");
  if (ANYWHERE.some((w) => squashed.includes(w))) return true;
  return plain.split(/[^a-z]+/).some((w) => WHOLE_WORD.includes(w));
}
