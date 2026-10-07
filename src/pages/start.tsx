// /start: launcher for the Pope Tech demo. Outside the university layout and free of scenarios: it must stay accessible.
// Card artwork is decorative (aria-hidden); the card text says everything. CSS: styles/features/start.css.
import { Link, type MetaFunction } from "react-router";
import { scenarios } from "~/a11y/registry";
import { challenges } from "~/ctf/challenges";
import { arrow, AT_ICONS, icon } from "~/ctf/icons";
import { allRoutePaths } from "~/routes/inventory";

export const meta: MetaFunction = () => [{ title: "Pope Tech Accessibility Demo" }];

const BASE = import.meta.env.BASE_URL;
const check = icon(<path d="M5 12.5l4.5 4.5L19 7.5" />);

const UniversityArt = () => (
  <div className="start-browser">
    <div className="start-browser-bar"><i /><i /><i /><span>redwoodstate.edu</span></div>
    <img src={`${BASE}start/university.jpg`} alt="" width="1264" height="860" />
  </div>
);

const ChallengesArt = () => (
  <div className="start-at">
    {challenges.map((c) => (
      <div key={c.id} className={`start-at-tile start-at-tile--${c.id}`}>
        <span className="start-at-icon">{AT_ICONS[c.id]}</span>
        <b>{c.at}</b>
        <span className="start-at-pts">{c.basePoints} pts</span>
      </div>
    ))}
  </div>
);

const BARS = [38, 54, 46, 70, 62, 84, 78];
const PlatformArt = () => (
  <div className="start-app">
    <div className="start-app-bar"><img src={`${BASE}brand/pope-tech-mark.svg`} alt="" width="18" height="18" /><i /><i /><i /></div>
    <div className="start-app-body">
      <div className="start-app-score"><div className="start-ring"><b>94</b></div><span>Accessibility score</span></div>
      <div className="start-app-chart">
        <div className="start-app-kpis">
          <span><i className="dot dot--err" />Errors <b>12</b></span>
          <span><i className="dot dot--alert" />Alerts <b>48</b></span>
          <span><i className="dot dot--ok" />Pages <b>1,284</b></span>
        </div>
        <div className="start-bars">{BARS.map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</div>
      </div>
    </div>
  </div>
);

const MODULES = [["Week 1: Welcome", "ok"], ["Syllabus.pdf", "ok"], ["Lecture slides", "err"], ["Lab video", "ok"]] as const;
const CanvasArt = () => (
  <div className="start-lms">
    <div className="start-lms-nav"><i /><i /><i /><i /></div>
    <div className="start-lms-main">
      <b className="start-lms-title">Biology 101 · Modules</b>
      {MODULES.map(([name, s]) => (
        <div key={name} className="start-lms-row"><i className={`start-lms-status start-lms-status--${s}`}>{s === "ok" ? check : "!"}</i><span>{name}</span></div>
      ))}
    </div>
    <div className="start-lms-pop">
      <img src={`${BASE}brand/pope-tech-mark.svg`} alt="" width="22" height="22" />
      <div><b>1 issue to fix</b><span>Image missing alt text</span></div>
    </div>
  </div>
);

export default function StartPage() {
  return (
    <main id="main-content" className="start">
      <header className="start-head">
        <div className="start-kicker"><img src={`${BASE}brand/pope-tech-mark.svg`} alt="" width="28" height="28" />Pope Tech</div>
        <h1>Accessibility, hands on.</h1>
        <p className="start-lede">Explore a university website built with accessibility issues on purpose, take on the assistive technology challenges, then see how Pope Tech finds and fixes issues like these.</p>
      </header>

      <ul className="start-grid">
        <li className="start-card start-card--uni">
          <div className="start-media" aria-hidden="true"><UniversityArt /></div>
          <div className="start-body">
            <p className="start-eyebrow">Practice website</p>
            <h2>Redwood State University</h2>
            <p>A realistic university website with accessibility issues built in on purpose. Find them, test them, then switch on the fixes in the Accessibility Lab.</p>
            <dl className="start-stats">
              <div><dt>Pages</dt><dd>{allRoutePaths().length}</dd></div>
              <div><dt>Accessibility issues</dt><dd>{scenarios.size}</dd></div>
              <div><dt>Fix levels</dt><dd>3</dd></div>
            </dl>
            <Link className="start-cta" to="/">Visit Redwood State University {arrow}</Link>
          </div>
        </li>

        <li className="start-card start-card--ctf">
          <div className="start-media" aria-hidden="true"><ChallengesArt /></div>
          <div className="start-body">
            <p className="start-eyebrow">Capture the flag</p>
            <h2>Assistive technology challenges</h2>
            <ul className="start-challenges">
              {challenges.map((c) => (
                <li key={c.id}>
                  <Link to={c.path}>
                    <span className={`start-chip start-at-tile--${c.id}`}>{AT_ICONS[c.id]}</span>
                    <span><b>{c.title}</b><span className="start-muted">{c.at}</span></span>
                    {arrow}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>

        <li className="start-card start-card--app">
          <div className="start-media" aria-hidden="true"><PlatformArt /></div>
          <div className="start-body">
            <p className="start-eyebrow">Web accessibility</p>
            <h2>Pope Tech Platform Demo</h2>
            <p>Scan every page of your websites, see issues in context and track progress across your whole organization.</p>
            <a className="start-cta" href="https://app.pope.tech/">Open the Platform demo {arrow}</a>
          </div>
        </li>

        <li className="start-card start-card--lms">
          <div className="start-media" aria-hidden="true"><CanvasArt /></div>
          <div className="start-body">
            <p className="start-eyebrow">Course content</p>
            <h2>Pope Tech Canvas Demo</h2>
            <p>Find and fix accessibility issues in Canvas courses, right where instructors build them.</p>
            <a className="start-cta" href="https://popetech.instructure.com/">Open the Canvas demo {arrow}</a>
          </div>
        </li>
      </ul>
    </main>
  );
}
