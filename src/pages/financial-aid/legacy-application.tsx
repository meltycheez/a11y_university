// /financial-aid/legacy-application: Legacy Financial Aid Form, one of the six terrible pages (plan 06 #9, plan 07; tier T).
// A ~2006 form dropped into the new site: layout tables, inline font styling, an image submit button, a CAPTCHA with
// no alternative, href="#" links (ADR-031), a silent 5-minute session. It still works with a mouse and ends in an
// on-page confirmation; nothing is sent. Scenarios: src/a11y/registry/legacy-aid.ts. CSS: styles/features/legacy-aid.css.
// The page title comes from ScenarioTitle (legacy-aid-page-title-001), not meta() (ADR-008).
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ScenarioTitle } from "~/a11y/DocumentScenarios";
import { SmartLink } from "~/a11y/helpers";
import { legacyAidScenarios } from "~/a11y/registry/legacy-aid";
import { pageTitle } from "~/data/brand";
import { pageContent } from "~/data/content/pages";
import { confirmationCode, latency } from "~/lib/interactive";
import { useFixes } from "../admissions/_useFixes";

const content = pageContent["/financial-aid/legacy-application"];
const svg = (s: string) => `data:image/svg+xml,${encodeURIComponent(s)}`;

const BANNER = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="780" height="80" viewBox="0 0 780 80"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#5a1f14"/><stop offset="1" stop-color="#9b3b26"/></linearGradient></defs><rect width="780" height="80" fill="url(#g)"/><rect y="74" width="780" height="6" fill="#c9a227"/><text x="20" y="36" font-family="Georgia, serif" font-size="26" fill="#fff">Redwood State University</text><text x="22" y="60" font-family="Verdana, sans-serif" font-size="13" fill="#f2dfa0">Office of Financial Aid  ::  Online Services</text></svg>`);
const ARROW = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="7" height="9" viewBox="0 0 7 9"><path d="M0 0l7 4.5L0 9z" fill="#9b3b26"/></svg>`);
const SPACER = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>`);
const REFRESH = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M15 9a6 6 0 1 1-2-4.5" fill="none" stroke="#335" stroke-width="2"/><path d="M13.5 1v4h-4" fill="none" stroke="#335" stroke-width="2"/></svg>`);
const SUBMIT = svg(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="26" viewBox="0 0 96 26"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fdfdfd"/><stop offset="1" stop-color="#c8c8c8"/></linearGradient></defs><rect x=".5" y=".5" width="95" height="25" rx="3" fill="url(#b)" stroke="#777"/><text x="48" y="17.5" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#333">SUBMIT</text></svg>`);

// Deterministic CAPTCHA images (no external service). The fixed state adds a text question the same box accepts.
const CODES = ["7KQ2M", "H4XP9", "3RW8T"];
const captcha = (code: string) => svg(`<svg xmlns="http://www.w3.org/2000/svg" width="150" height="46" viewBox="0 0 150 46"><rect width="150" height="46" fill="#e9e4d8"/>${
  [0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 ${8 + i * 7} Q75 ${(i * 17) % 46} 150 ${40 - i * 6}" stroke="#${["b98", "9ab", "a9c", "bb9", "9cb", "caa"][i]}" fill="none"/>`).join("")
}${[...code].map((ch, i) => `<text x="${14 + i * 26}" y="${31 + ((i * 5) % 9) - 4}" transform="rotate(${[-14, 9, -6, 16, -10][i]} ${20 + i * 26} 26)" font-family="Courier New, monospace" font-size="26" font-weight="700" fill="#${["533", "335", "353", "553", "355"][i]}">${ch}</text>`).join("")}</svg>`);
const CAPTCHA_ANSWER = "7"; // "What is 4 plus 3?"

const WARN_MS = 4 * 60_000;   // fixed state: warning at 4:00
const EXPIRE_MS = 5 * 60_000; // both states: session ends at 5:00

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 60 }, (_, i) => String(2010 - i));
const ENROLL = ["Full-time (12+ units)", "Three-quarter time (9-11 units)", "Half-time (6-8 units)", "Less than half-time"];
const AID = [["sug", "State University Grant (SUG)"], ["eop", "EOP Grant"], ["emergency", "RSU Emergency Aid Fund"]];
const TERMS = ["Academic Year 2026-27", "Fall 2026 only", "Spring 2027 only"];

// Layout-table primitives (legacy-aid-layout-table-001): <table>/<tr>/<td> while defective, <div>s once fixed.
// Module-level components so re-renders never remount the form fields inside them.
const CssLayout = createContext(false);
function LT({ className = "", children, width }: { className?: string; children: React.ReactNode; width?: number }) {
  return useContext(CssLayout)
    ? <div className={`lt ${className}`}>{children}</div>
    : <table className={`lt ${className}`} width={width} cellPadding={3} cellSpacing={0} border={0}><tbody>{children}</tbody></table>;
}
function LR({ children }: { children: React.ReactNode }) {
  return useContext(CssLayout) ? <div className="lr">{children}</div> : <tr>{children}</tr>;
}
function LC({ children, className = "", colSpan, width, valign }: { children?: React.ReactNode; className?: string; colSpan?: number; width?: number; valign?: "top" }) {
  return useContext(CssLayout)
    ? <div className={`lc ${colSpan ? "lc--full " : ""}${className}`}>{children}</div>
    : <td className={className} colSpan={colSpan} width={width} valign={valign}>{children}</td>;
}

type Data = Record<string, string>;
type Err = { field: string; message: string };

export function validateLegacy(d: Data, code: string, textAlt: boolean): Err[] {
  const e: Err[] = [];
  const need = (f: string, m: string) => { if (!d[f]?.trim()) e.push({ field: f, message: m }); };
  if (!/^9\d{8}$/.test(d.sid ?? "")) e.push({ field: "sid", message: "Student ID #: enter your 9-digit RSU ID (it starts with 9)." });
  need("last", "Last name is required.");
  need("first", "First name is required.");
  if (!d["dob-m"] || !d["dob-d"] || !d["dob-y"]) e.push({ field: "dob-m", message: "Date of birth: choose month, day and year." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email ?? "")) e.push({ field: "email", message: "E-mail: enter an address like name@example.com." });
  need("street", "Mailing address is required.");
  need("city", "City is required.");
  if (!/^\d{5}$/.test(d.zip ?? "")) e.push({ field: "zip", message: "ZIP: enter 5 digits." });
  need("enroll", "Enrollment status: choose one.");
  if (!AID.some(([k]) => d[`aid-${k}`] === "yes")) e.push({ field: "aid-sug", message: "Aid requested: check at least one type of aid." });
  if (!/^\d[\d,]*$/.test(d.income ?? "")) e.push({ field: "income", message: "Total household income: enter a whole dollar amount, for example 42000." });
  need("explanation", "Explain your circumstances is required.");
  if (d.certify !== "yes") e.push({ field: "certify", message: "Certification: check the box to certify your answers." });
  const answer = (d.captcha ?? "").trim().toUpperCase();
  if (answer !== code && !(textAlt && answer === CAPTCHA_ANSWER)) e.push({ field: "captcha", message: "Security code: type the characters shown, or answer the question." });
  return e;
}

export default function LegacyAidPage() {
  const { fix, mark } = useFixes(legacyAidScenarios, "legacy-aid-");
  const [d, setD] = useState<Data>({});
  const [errors, setErrors] = useState<Err[]>([]);
  const [help, setHelp] = useState<Record<string, boolean>>({});
  const [codeIndex, setCodeIndex] = useState(0);
  const [status, setStatus] = useState<"form" | "sending" | "done" | "expired">("form");
  const [warn, setWarn] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [confirmation, setConfirmation] = useState("");
  const errorBox = useRef<HTMLDivElement>(null);
  const confirmHeading = useRef<HTMLHeadingElement>(null);
  const nav = useRef<HTMLDivElement>(null);
  const code = CODES[codeIndex];
  const set = (k: string, v: string) => setD((p) => ({ ...p, [k]: v }));

  // Session: silent 5-minute limit; the fixed state warns at 4:00 and can extend. Cleared on unmount.
  const extendable = fix("timeout");
  const live = status === "form" || status === "sending";
  useEffect(() => {
    if (!live) return;
    const t = [setTimeout(() => { setStatus("expired"); setWarn(false); setD({}); setErrors([]); }, EXPIRE_MS)];
    if (extendable) t.push(setTimeout(() => setWarn(true), WARN_MS));
    return () => t.forEach(clearTimeout);
  }, [epoch, extendable, live]);

  // 2006-style rollovers: real inline onmouseover/onmouseout attributes, so scanners can see them (ADR-030).
  const rollover = !fix("nav-rollover");
  useEffect(() => {
    for (const a of nav.current?.querySelectorAll("a") ?? []) {
      if (rollover) {
        a.setAttribute("onmouseover", "this.style.backgroundColor='#ffffcc'");
        a.setAttribute("onmouseout", "this.style.backgroundColor=''");
      } else {
        a.removeAttribute("onmouseover");
        a.removeAttribute("onmouseout");
        a.removeAttribute("style");
      }
    }
  }); // every render: fixing other scenarios can remount the links

  useEffect(() => { if (status === "done" && fix("confirm-focus")) confirmHeading.current?.focus(); }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- 2006 building blocks ----------
  const small: React.CSSProperties = { fontFamily: "Verdana, Arial, Helvetica, sans-serif", fontSize: fix("text-small") ? undefined : "10px" };
  const instructions: React.CSSProperties = { ...small, color: fix("intro-contrast") ? "#333333" : "#999999", textAlign: fix("justified") ? undefined : "justify" };
  const reqFixed = fix("required-color");
  const ti = (n: number) => (fix("tabindex") ? {} : { tabIndex: n });
  const req = reqFixed ? { required: true } : {};

  /** Prompt cell text: a <label for> once its scenario is fixed, otherwise bare text (red when required). */
  const prompt = (text: string, forId: string, opts: { req?: boolean; key?: string; wrongFor?: string } = {}) => {
    const { key = "fields-label", wrongFor } = opts;
    const style: React.CSSProperties = { fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 700, color: opts.req && !reqFixed ? "#cc0000" : undefined };
    const body = <>{text}{opts.req && reqFixed ? " (required)" : ""}:</>;
    if (wrongFor) return <label htmlFor={fix(key) ? forId : wrongFor} style={style}>{body}</label>;
    return fix(key) ? <label htmlFor={forId} style={style}>{body}</label> : <span style={style}>{body}</span>;
  };
  const helpLink = (key: string, text: string) => (
    <>
      {fix("help-javascript")
        ? <button type="button" className="legacy-linkbutton" aria-expanded={!!help[key]} aria-controls={`help-${key}`} onClick={() => setHelp((h) => ({ ...h, [key]: !h[key] }))}>[Help]</button>
        : <a href="#" onClick={(e) => { e.preventDefault(); setHelp((h) => ({ ...h, [key]: !h[key] })); }}>[Help]</a>}
      <div id={`help-${key}`} className="legacy-help" hidden={!help[key]} style={small}>{text}</div>
    </>
  );
  const input = (id: string, tab: number, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <input id={id} name={id} value={d[id] ?? ""} onChange={(e) => set(id, e.target.value)} className="legacy-input" {...ti(tab)} {...props} />
  );
  const section = (title: string) => (
    <LR><LC colSpan={2} className="legacy-section">{fix("section-headings") ? <h2>{title}</h2> : <b>{title.toUpperCase()}</b>}</LC></LR>
  );
  const printControl = fix("print-mouse")
    ? <button type="button" className="legacy-linkbutton" onClick={() => window.print()}>Print this form</button>
    : <a className="legacy-print" onClick={() => window.print()}>Print this form</a>;

  // ---------- submit ----------
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateLegacy(d, code, fix("captcha-alt"));
    setErrors(found);
    if (found.length) {
      if (fix("errors-not-announced")) requestAnimationFrame(() => errorBox.current?.focus());
      return;
    }
    setStatus("sending");
    await latency("legacy-aid-submit");
    setConfirmation(confirmationCode(`${d.sid}|${d.last}|${d.income}`));
    setStatus("done");
  };
  const restart = () => { setD({}); setErrors([]); setStatus("form"); setWarn(false); setEpoch((n) => n + 1); };

  const Title = fix("title-heading-skip") ? "h1" : "h3";
  const hhIds = ["hh-name", "hh-rel", "hh-age", "hh-student"];
  const dateSelect = (part: "m" | "d" | "y", options: string[], tab: number, name: string) => (
    <>
      {fix("selects-label") && <label htmlFor={`dob-${part}`} className="visually-hidden">{name}</label>}
      <select id={`dob-${part}`} value={d[`dob-${part}`] ?? ""} onChange={(e) => set(`dob-${part}`, e.target.value)} {...ti(tab)} {...req}>
        <option value="">--</option>{options.map((o, i) => <option key={o} value={part === "m" ? String(i + 1) : o}>{o}</option>)}
      </select>
    </>
  );
  const enrollRadios = ENROLL.map((o, i) => (
    <label key={o} className="legacy-opt"><input type="radio" name="enroll" id={i === 0 ? "enroll" : undefined} checked={d.enroll === o} onChange={() => set("enroll", o)} {...ti(20 + i)} /> {o}</label>
  ));
  const aidBoxes = AID.map(([k, l], i) => (
    <label key={k} className="legacy-opt"><input type="checkbox" id={`aid-${k}`} checked={d[`aid-${k}`] === "yes"} onChange={(e) => set(`aid-${k}`, e.target.checked ? "yes" : "")} {...ti(24 + i)} /> {l}</label>
  ));

  const form = (
    <form onSubmit={submit} noValidate className="legacy-form" {...mark("fields-label", "selects-label", "explain-for", "image-submit", "duplicate-phone-id", "help-javascript", "enroll-fieldset", "section-headings", "required-color", "tabindex", "aid-ungrouped", "input-contrast")}>
      <div ref={errorBox} className="legacy-errors" tabIndex={fix("errors-not-announced") ? -1 : undefined} role={fix("errors-not-announced") ? "alert" : undefined}
        {...mark("errors-vague", "errors-not-announced")}>
        {errors.length > 0 && (fix("errors-vague")
          ? <><b>Please correct {errors.length} {errors.length === 1 ? "item" : "items"}:</b><ul>{errors.map((x) => <li key={x.field}><a href={`#${x.field}`}>{x.message}</a></li>)}</ul></>
          : <b>ERROR: Invalid input. Please check the form and try again.</b>)}
      </div>
      <p style={small}>{reqFixed ? "Fields marked (required) must be completed." : <>Items in <span style={{ color: "#cc0000" }}>red</span> are required.</>}</p>
      <LT className="legacy-fields" width={600}>
        {section("Student Information")}
        <LR><LC width={170}>{prompt("Student ID #", "sid", { req: true })}</LC><LC>{input("sid", 1, { size: 12, maxLength: 9, ...req })} {helpLink("sid", "Your 9-digit RSU ID begins with 9 and is printed on your OwlCard.")}</LC></LR>
        <LR><LC>{prompt("Last Name", "last", { req: true })}</LC><LC>{input("last", 2, { size: 25, ...req })}</LC></LR>
        <LR><LC>{prompt("First Name", "first", { req: true })}</LC><LC>{input("first", 4, { size: 20, ...req })} <span style={small}>M.I.</span> {input("mi", 3, { size: 2, maxLength: 1, ...(fix("fields-label") ? { "aria-label": "Middle initial" } : {}) })}</LC></LR>
        <LR>
          <LC>{fix("selects-label") ? <span id="dob-label" style={{ fontFamily: "Arial, Helvetica, sans-serif", fontWeight: 700, color: reqFixed ? undefined : "#cc0000" }}>Date of Birth{reqFixed ? " (required)" : ""}:</span> : prompt("Date of Birth", "dob-m", { req: true, key: "selects-label" })}</LC>
          <LC>
            {fix("selects-label")
              ? <fieldset className="legacy-inline-fieldset" aria-labelledby="dob-label">{dateSelect("m", MONTHS, 12, "Month")} {dateSelect("d", DAYS, 11, "Day")} {dateSelect("y", YEARS, 10, "Year")}</fieldset>
              : <>{dateSelect("m", MONTHS, 12, "Month")} {dateSelect("d", DAYS, 11, "Day")} {dateSelect("y", YEARS, 10, "Year")}</>}
          </LC>
        </LR>
        <LR><LC>{prompt("Home Phone", fix("duplicate-phone-id") ? "phone-home" : "phone")}</LC><LC>{input(fix("duplicate-phone-id") ? "phone-home" : "phone", 6, { size: 14, type: "tel" })}</LC></LR>
        <LR><LC>{prompt("Cell Phone", fix("duplicate-phone-id") ? "phone-cell" : "phone")}</LC><LC>{input(fix("duplicate-phone-id") ? "phone-cell" : "phone", 5, { size: 14, type: "tel", value: d["phone-cell"] ?? "", onChange: (e) => set("phone-cell", e.target.value) })}</LC></LR>
        <LR><LC>{prompt("E-mail", "email", { req: true })}</LC><LC>{input("email", 7, { size: 30, type: "email", ...req })}</LC></LR>
        <LR><LC>{prompt("Mailing Address", "street", { req: true })}</LC><LC>{input("street", 9, { size: 35, ...req })}</LC></LR>
        <LR><LC>{prompt("City / State / ZIP", "city", { req: true })}</LC><LC>{input("city", 8, { size: 16, ...req })} {input("state", 14, { size: 2, maxLength: 2, ...(fix("fields-label") ? { "aria-label": "State" } : {}) })} {input("zip", 13, { size: 6, maxLength: 5, ...req, ...(fix("fields-label") ? { "aria-label": "ZIP code" } : {}) })}</LC></LR>

        {section("Enrollment")}
        <LR>
          <LC valign="top">{fix("enroll-fieldset") ? null : prompt("Enrollment Status", "enroll", { req: true })}</LC>
          <LC>{fix("enroll-fieldset")
            ? <fieldset className="legacy-inline-fieldset"><legend style={{ fontWeight: 700, color: reqFixed ? undefined : "#cc0000" }}>Enrollment status{reqFixed ? " (required)" : ""}</legend>{enrollRadios}</fieldset>
            : enrollRadios}</LC>
        </LR>
        <LR>
          <LC valign="top">{fix("aid-ungrouped") ? null : prompt("Aid Requested", "aid-sug", { req: true })}</LC>
          <LC>{fix("aid-ungrouped")
            ? <fieldset className="legacy-inline-fieldset"><legend style={{ fontWeight: 700, color: reqFixed ? undefined : "#cc0000" }}>Aid requested{reqFixed ? " (required)" : ""}</legend>{aidBoxes}</fieldset>
            : aidBoxes}</LC>
        </LR>
        <LR>
          <LC>{prompt("Term", "term", { key: "selects-label" })}</LC>
          <LC><select id="term" value={d.term ?? TERMS[0]} onChange={(e) => set("term", e.target.value)} {...ti(15)}>{TERMS.map((t) => <option key={t}>{t}</option>)}</select></LC>
        </LR>

        {section("Household Information")}
        <LR><LC>{prompt("Household Size", "hhsize")}</LC><LC>{input("hhsize", 16, { size: 3, maxLength: 2, inputMode: "numeric" })}</LC></LR>
        <LR><LC>{prompt("Total Household Income (2025)", "income", { req: true })}</LC><LC>$ {input("income", 17, { size: 12, inputMode: "numeric", ...req })} {helpLink("income", "Include wages, benefits and untaxed income for everyone in your household for calendar year 2025.")}</LC></LR>
        <LR>
          <LC colSpan={2}>
            <span style={small}>List other members of your household:</span>
            <table className="legacy-household" border={1} cellPadding={2} cellSpacing={0} {...mark("household-headers", "household-inputs", "household-caption")}>
              {fix("household-caption") && <caption>Other members of your household</caption>}
              <thead><tr>{["Name", "Relationship", "Age", "Student? (Y/N)"].map((h, i) => <th key={h} id={hhIds[i]}>{h}</th>)}</tr></thead>
              <tbody>
                {[1, 2, 3].map((row) => (
                  <tr key={row}>
                    {hhIds.map((h, i) => {
                      const id = `${h}-${row}`;
                      const names = ["name", "relationship", "age", "student (Y or N)"];
                      return (
                        <td key={h} headers={fix("household-headers") ? h : h.replace("-", "_")}>
                          <input className="legacy-input" size={[18, 12, 3, 2][i]} value={d[id] ?? ""} onChange={(e) => set(id, e.target.value)}
                            {...(fix("household-inputs") ? { "aria-label": `Member ${row} ${names[i]}` } : {})} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </LC>
        </LR>

        {section("Explanation of Need")}
        <LR>
          <LC valign="top">{prompt("Explain your circumstances", "explanation", { req: true, wrongFor: "explain" })}</LC>
          <LC><textarea id="explanation" rows={5} cols={45} value={d.explanation ?? ""} onChange={(e) => set("explanation", e.target.value)} className="legacy-input" {...ti(18)} {...req} /></LC>
        </LR>

        {section("Certification")}
        <LR>
          <LC valign="top" className="legacy-right"><input type="checkbox" id="certify" checked={d.certify === "yes"} onChange={(e) => set("certify", e.target.checked ? "yes" : "")} {...ti(19)} {...req} /></LC>
          <LC>{fix("fields-label")
            ? <label htmlFor="certify" style={small}>I certify that the information on this form is true and complete to the best of my knowledge. (required)</label>
            : <span style={{ ...small, color: reqFixed ? undefined : "#cc0000" }}>I certify that the information on this form is true and complete to the best of my knowledge.</span>}</LC>
        </LR>
        <LR>
          <LC valign="top">{prompt("Security Code", "captcha", { req: true })}</LC>
          <LC>
            <span {...mark("captcha-alt", "captcha-refresh")}>
              <img src={captcha(code)} width={150} height={46} className="legacy-captcha" {...(fix("captcha-alt") ? { alt: "Security check image. If you can't read it, type the answer to this question instead: what is 4 plus 3?" } : {})} />
              {" "}<a href="#" onClick={(e) => { e.preventDefault(); setCodeIndex((i) => (i + 1) % CODES.length); }}>
                <img src={REFRESH} width={18} height={18} alt={fix("captcha-refresh") ? "Show a different security image" : ""} />
              </a>
            </span>
            {fix("captcha-alt") && <div style={small}>Can't read the image? Type the answer to this question instead: what is 4 plus 3?</div>}
            <div>{input("captcha", 30, { size: 8, autoComplete: "off", ...req })}</div>
            <span style={small}>Type the characters shown in the image (not case sensitive).</span>
          </LC>
        </LR>
        <LR>
          <LC />
          <LC>
            <input type="image" src={SUBMIT} width={96} height={26} className="legacy-image-button" {...(fix("image-submit") ? { alt: "Submit application" } : {})} {...ti(31)} />
            {" "}<input type="button" value="Clear Form" className="legacy-button" onClick={() => { setD({}); setErrors([]); }} {...ti(32)} />
          </LC>
        </LR>
      </LT>
      {status === "sending" && <p style={small}><b>Processing, please wait...</b></p>}
    </form>
  );

  return (
    <CssLayout.Provider value={fix("layout-table")}>
    <div className="legacy-aid" {...mark("layout-table", "text-small", "reflow", "focus-outline", "intro-contrast", "justified", "underline", "print-mouse", "timeout", "confirm-focus", "heading-empty", "title-heading-skip", "marquee")}>
      <ScenarioTitle scenario="legacy-aid-page-title-001" title={pageTitle("Institutional Aid Application")} />
      <LT className="legacy-frame" width={780}>
        <LR>
          <LC colSpan={2} className="legacy-banner-cell">
            <span {...mark("banner-alt", "banner-title", "banner-text-image")}>
              {fix("banner-text-image") ? (
                <span className="legacy-banner-text">
                  <span className="legacy-banner-name">Redwood State University</span>
                  <span className="legacy-banner-sub">Office of Financial Aid :: Online Services</span>
                </span>
              ) : (
                <img src={BANNER} width={780} height={80} className="legacy-banner"
                  {...(fix("banner-alt") ? { alt: "Redwood State University Office of Financial Aid, Online Services" } : {})}
                  {...(fix("banner-title") ? {} : { title: "banner" })} />
              )}
            </span>
          </LC>
        </LR>
        <LR>
          <LC width={160} valign="top" className="legacy-nav-cell">
            <div ref={nav} className="legacy-nav-wrap" {...mark("nav-list", "nav-arrows", "spacer-alt", "nav-duplicate", "nav-title", "nav-rollover")}>
              {(() => {
                const items = [
                  { to: "/", text: "RSU home", defect: "Home" },
                  { to: "/financial-aid", text: "Financial Aid home", defect: "Home" },
                  { to: "/financial-aid/types", text: "Types of Aid" },
                  { to: "/admissions/scholarships", text: "Scholarships" },
                  { to: "/admissions/tuition", text: "Tuition & Fees" },
                  { to: "mailto:finaid@redwoodstate.example.edu", text: "Contact Us" },
                ].map((l) => (
                  <li key={l.to}>
                    <img src={ARROW} width={7} height={9} alt={fix("nav-arrows") ? "" : "arrow"} />{" "}
                    <SmartLink scenario={l.defect ? "legacy-aid-nav-duplicate-001" : "legacy-aid-nav-title-001"} to={l.to}
                      defect={l.defect} defectTitle={l.defect ? undefined : l.text}>{l.text}</SmartLink>
                    <br /><img src={SPACER} width={1} height={8} alt={fix("spacer-alt") ? "" : "spacer"} />
                  </li>
                ));
                return fix("nav-list") ? <ul className="legacy-nav">{items}</ul> : <div className="legacy-nav">{items}</div>;
              })()}
            </div>
          </LC>
          <LC valign="top" className="legacy-content">
            {!fix("heading-empty") && <h2 className="legacy-spacer"></h2>}
            <div className={fix("marquee") ? "legacy-notice" : "legacy-notice legacy-marquee"}>
              <span>*** NEW! Priority deadline for 2026-27 institutional aid extended to March 2, 2027 ***</span>
            </div>
            <Title className="legacy-title">Institutional Aid Application 2026-27</Title>
            <p className="legacy-print-row" style={small}>{printControl} | <span>{content.updated}</span></p>
            <div className="legacy-instructions">
              <p style={instructions}>{content.sections[0].paragraphs![0].replace(" Incomplete applications will not be processed.", "")}{" "}
                Incomplete applications {fix("underline") ? <b>will not</b> : <u>will not</u>} be processed.</p>
              <p style={instructions}>{content.sections[0].paragraphs![1]}</p>
              <p style={instructions}>
                You must file the FAFSA or CADAA before submitting this form. To learn how,{" "}
                <SmartLink scenario="legacy-aid-fafsa-generic-001" to="/financial-aid" defect="click here">read how to file the FAFSA or CADAA</SmartLink>.
                {" "}See the{" "}
                <SmartLink scenario="legacy-aid-tuition-document-001" to="/documents/tuition-schedule-2025-26.pdf" fileInfo="PDF, 2 KB">Tuition schedule</SmartLink>
                {" "}for cost of attendance. Read our{" "}
                <SmartLink scenario="legacy-aid-privacy-new-window-001" to="/policies/privacy" newWindow>Privacy Notice</SmartLink>.
              </p>
              {extendable && <p style={instructions}><b>For your security, this session ends 5 minutes after the page loads.</b></p>}
            </div>
            {warn && status === "form" && (
              <div className="legacy-warning" role="alert">
                <b>Your session will end in 1 minute.</b> Anything you have entered will be lost.{" "}
                <button type="button" className="legacy-button" onClick={() => { setWarn(false); setEpoch((n) => n + 1); }}>Extend my session</button>
              </div>
            )}

            {(status === "form" || status === "sending") && form}
            {status === "expired" && (
              <div className="legacy-expired">
                <p><b style={{ color: "#cc0000" }}>Your session has timed out due to inactivity.</b></p>
                <p style={small}>Any information you entered has been lost. Please start again.</p>
                <input type="button" className="legacy-button" value="Start New Application" onClick={restart} />
              </div>
            )}
            {status === "done" && (
              <div className="legacy-confirm">
                <Title ref={confirmHeading} tabIndex={-1} className="legacy-title">Application Received</Title>
                <p>Thank you, {d.first} {d.last}. Your Institutional Aid Application has been received.</p>
                <p>Confirmation #: <b className="legacy-code">{confirmation}</b></p>
                <p style={small}>Please print this page for your records. Allow 4-6 weeks for processing. (Demonstration site: nothing was sent.)</p>
                <p>{printControl}</p>
              </div>
            )}
          </LC>
        </LR>
        <LR><LC colSpan={2} className="legacy-footer"><span style={small}>&copy; 2006-2017 Redwood State University Office of Financial Aid. Best viewed at 800x600.</span></LC></LR>
      </LT>
    </div>
    </CssLayout.Provider>
  );
}
