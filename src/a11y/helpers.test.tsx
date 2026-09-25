import { act, cleanup, render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { afterEach, expect, it } from "vitest";
import { Field, Heading, IconButton, SmartLink } from "./helpers";
import { a11yStore } from "./state";

afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });
const inRouter = (ui: React.ReactNode) => render(<RouterProvider router={createMemoryRouter([{ path: "/", element: ui }])} />);

// Seed scenario ids stand in for real ones: home-card-img-alt-suspicious-001 is an alert, the rest errors.
it("helpers switch markup with their scenario's toggle", () => {
  const { container } = inRouter(
    <>
      <SmartLink scenario="home-card-img-alt-suspicious-001" to="/documents/x.pdf" defect="Read more" fileInfo="PDF, 1 MB" newWindow>Tuition schedule</SmartLink>
      <IconButton scenario="home-hero-img-alt-001" label="Search" icon="🔍" />
      <Field scenario="home-program-finder-label-001" id="q" label="Keyword" defect="placeholder" />
      <Heading scenario="home-hero-img-alt-001" level={3} defect="skipped" defectLevel={5}>Title</Heading>
    </>,
  );
  const q = (s: string) => container.querySelector(s)!;
  expect(q("a").textContent).toBe("Read more");
  expect(q("button").textContent).toBe("🔍");
  expect(q("input").getAttribute("placeholder")).toBe("Keyword");
  expect(container.querySelector("label")).toBeNull();
  expect(q("h5").textContent).toBe("Title");

  act(() => a11yStore.fixAll());
  expect(q("a").textContent).toBe("Tuition schedule (PDF, 1 MB, opens in a new tab)");
  expect(q("button").textContent).toBe("🔍Search");
  expect(q("label").getAttribute("for")).toBe("q");
  expect(q("h3").textContent).toBe("Title");
});
