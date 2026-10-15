import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { useErrorSummary } from "./ErrorSummary";

afterEach(cleanup);

function Form() {
  const { check, summary } = useErrorSummary();
  return (
    <form noValidate onSubmit={(e) => { e.preventDefault(); check(e.currentTarget); }}>
      {summary}
      <label htmlFor="f-name">First name (required)</label><input id="f-name" required />
      <label htmlFor="f-email">Email (required)</label><input id="f-email" type="email" required defaultValue="nope" />
      <label htmlFor="f-phone">Phone (optional)</label><input id="f-phone" />
      <fieldset><legend>I am a… (required)</legend>
        <label><input type="radio" id="f-type" name="type" required /> Student</label>
        <label><input type="radio" name="type" required /> Parent</label>
      </fieldset>
      <label htmlFor="f-term">Start term (required)</label><select id="f-term" required><option value="">Select one</option><option>Fall</option></select>
      <button type="submit">Send</button>
    </form>
  );
}

it("lists each invalid field by name with the reason, takes focus, and its links focus the fields (plan 14 §6)", () => {
  render(<Form />);
  expect(screen.queryByRole("alert")).toBeNull(); // nothing until a submit fails
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  const summary = screen.getByRole("alert");
  expect(document.activeElement).toBe(summary);
  expect(screen.getByRole("heading", { name: "Form errors (4): Select a link to go to the field with the error." })).toBeTruthy();
  expect([...summary.querySelectorAll("li")].map((li) => li.textContent)).toEqual([
    "First name: Enter your first name.",
    "Email: Enter an email address like name@example.com.",
    "I am a…: Choose one option.", // one entry per radio group, linked to its first button
    "Start term: Select an option.",
  ]);
  expect(screen.getByLabelText("First name (required)").getAttribute("aria-invalid")).toBe("true");
  expect(screen.getByLabelText("Phone (optional)").hasAttribute("aria-invalid")).toBe(false);
  fireEvent.click(screen.getByRole("link", { name: "I am a…" }));
  expect(document.activeElement?.id).toBe("f-type");

  // Fixing everything clears the summary and the invalid marks.
  fireEvent.change(screen.getByLabelText("First name (required)"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Email (required)"), { target: { value: "ada@example.com" } });
  fireEvent.click(document.getElementById("f-type")!);
  fireEvent.change(screen.getByLabelText("Start term (required)"), { target: { value: "Fall" } });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getByLabelText("First name (required)").hasAttribute("aria-invalid")).toBe(false);
});
