import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { a11yStore } from "~/a11y/state";
import { Accordion } from "./Accordion";
import { Modal } from "./Modal";
import { Tabs } from "./Tabs";
import { DatePicker, Dropdown, Toast } from "./widgets";

// jsdom has no <dialog> methods.
Object.assign(HTMLDialogElement.prototype, {
  showModal(this: HTMLDialogElement) { this.open = true; },
  show(this: HTMLDialogElement) { this.open = true; },
  close(this: HTMLDialogElement) { this.open = false; },
});
afterEach(() => { cleanup(); act(() => a11yStore.resetAll()); });
// Seed ids stand in for real ones: home-hero-img-alt-001 is an error scenario, so Fix Errors fixes all of these.
const S = "home-hero-img-alt-001";

it("widget defect variants render broken markup until fixed", () => {
  const noop = () => {};
  const { container } = render(
    <>
      <Tabs label="T" scenario={S} defect="bad-children" tabs={[{ label: "A", content: "a" }, { label: "B", content: "b" }]} />
      <Accordion scenario={S} defect="div-trigger" items={[{ title: "Q", content: "A" }]} />
      <Modal open title="Hold" onClose={noop} scenario={S} defect="no-semantics">Body</Modal>
      <Dropdown label="Term" scenario={S} defect="mouse-only" value="f" onChange={noop} options={[{ value: "f", label: "Fall" }]} />
      <DatePicker label="Date" scenario={S} defect="mouse-only-grid" value="" onChange={noop} min="2026-10-06" max="2026-11-30" />
      <Toast message="Saved" onDismiss={noop} scenario={S} defect="vanishes" />
    </>,
  );
  const q = (s: string) => container.querySelector(s);
  expect(q('[role="tablist"]')).not.toBeNull();
  expect(q('[role="tab"]')).toBeNull();
  expect(q(".accordion-trigger")).not.toBeNull();
  expect(q(".modal--div")).not.toBeNull();
  expect(q("select")).toBeNull();
  expect(q('input[type="date"]')).toBeNull();
  expect(q('[role="status"]')).toBeNull();
  fireEvent.click(q(".accordion-trigger")!);
  expect(q(".accordion-panel")!.hasAttribute("hidden")).toBe(false);

  act(() => a11yStore.set({ fixErrors: true }));
  expect(container.querySelectorAll('[role="tab"]').length).toBe(2);
  expect(q(".accordion-heading button")!.getAttribute("aria-expanded")).toBe("true");
  expect(q("dialog.modal")).not.toBeNull();
  expect(q("select")).not.toBeNull();
  expect(q('input[type="date"]')!.getAttribute("min")).toBe("2026-10-06");
  expect(q('[role="status"]')!.textContent).toContain("Saved");
});

it("Tabs: arrow/Home/End move focus once fixed, do nothing while broken-keys", () => {
  const tabs = [{ label: "A", content: "a" }, { label: "B", content: "b" }, { label: "C", content: "c" }];
  const { container } = render(<Tabs label="T" scenario={S} defect="broken-keys" tabs={tabs} />);
  const buttons = () => [...container.querySelectorAll<HTMLButtonElement>(".tab")];
  buttons()[0].focus();
  fireEvent.keyDown(container.querySelector(".tab-list")!, { key: "ArrowRight" });
  expect(document.activeElement).toBe(buttons()[0]); // broken: no key handler attached

  act(() => a11yStore.set({ fixErrors: true }));
  buttons()[0].focus();
  fireEvent.keyDown(container.querySelector(".tab-list")!, { key: "ArrowRight" });
  expect(document.activeElement).toBe(buttons()[1]);
  fireEvent.keyDown(container.querySelector(".tab-list")!, { key: "End" });
  expect(document.activeElement).toBe(buttons()[2]);
  fireEvent.keyDown(container.querySelector(".tab-list")!, { key: "Home" });
  expect(document.activeElement).toBe(buttons()[0]);
});
