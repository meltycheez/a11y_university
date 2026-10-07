import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";
import { PopeTechWidget } from "./a11y/PopeTechWidget";
import { HtmlLang } from "./a11y/DocumentScenarios";
import { useHighlight } from "./a11y/useHighlight";
import { usePathname } from "./routes/usePathname";

import "@fontsource-variable/source-sans-3";
import "@fontsource-variable/source-serif-4";
import "./styles/index.css";

export const links: Route.LinksFunction = () => [
  { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.svg`, type: "image/svg+xml" },
];

/** Pope Tech demo pages outside the university layout (routes.ts): no widget. */
const STANDALONE = ["/start", "/leaderboard", "/ctf"];

export function Layout({ children }: { children: React.ReactNode }) {
  // University pages ship without `lang` (scenario global-html-lang-001, handled by HtmlLang).
  // The Accessibility Lab and the standalone demo pages are infrastructure and always declare it.
  const path = usePathname();
  const standalone = STANDALONE.includes(path);
  const lab = path.startsWith("/accessibility-lab") || standalone;
  useHighlight();
  return (
    <html lang={lab ? "en" : undefined}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <Meta />
        <Links />
      </head>
      <body>
        {!lab && <HtmlLang />}
        {children}
        {!standalone && <PopeTechWidget />}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const is404 = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main id="main-content" className="container error-page">
      <h1>{is404 ? "Page not found" : "Something went wrong"}</h1>
      <p>{is404 ? "The page you requested could not be found." : "An unexpected error occurred."}</p>
      <p><a href={import.meta.env.BASE_URL}>Return to the Redwood State home page</a></p>
    </main>
  );
}
