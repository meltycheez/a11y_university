// Google Apps Script for the shared CTF leaderboard (src/ctf/remote.ts).
// Setup: open the sheet > Extensions > Apps Script, paste this file, Deploy > New deployment > Web app,
// Execute as: Me, Who has access: Anyone. Put the /exec URL in .env as VITE_LEADERBOARD_URL and rebuild.
// Anyone with the URL can post a score: fine for a demo booth, not for prizes.

const HEADERS = ["handle", "challengeId", "score", "flag", "finishedAt", "noMouse"];
const CHALLENGES = ["apply-sr", "registration-voice", "map-eyes"];

function sheet_() {
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (s.getLastRow() === 0) s.appendRow(HEADERS);
  return s;
}

// Stops a name like "=HYPERLINK(...)" from running as a formula.
const text_ = (v, max) => String(v ?? "").slice(0, max).replace(/^[=+\-@]/, "'$&");

function doGet() {
  const values = sheet_().getDataRange().getValues();
  const rows = values.slice(1).map((r) => Object.fromEntries(HEADERS.map((h, i) => [h, r[i]])));
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const score = Number(d.score);
  if (!CHALLENGES.includes(d.challengeId) || !Number.isFinite(score) || score < 0 || score > 1000 || !String(d.handle ?? "").trim()) {
    return ContentService.createTextOutput("rejected");
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([text_(d.handle.trim(), 40), d.challengeId, score, text_(d.flag, 60), text_(d.finishedAt, 30), d.noMouse === true]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput("ok");
}
