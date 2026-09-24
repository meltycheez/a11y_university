import { Form } from "react-router";

export function SiteSearch() {
  return (
    <Form action="/search" method="get" role="search" className="site-search">
      <label htmlFor="site-search-q" className="visually-hidden">Search Redwood State</label>
      <input id="site-search-q" name="q" type="search" placeholder="Search Redwood State" autoComplete="off" />
      <button type="submit" className="site-search-submit">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M15.5 15.5 L21 21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
        <span className="visually-hidden">Search</span>
      </button>
    </Form>
  );
}
