// /portal/todo: open items as a checklist (checks live in ./_store for this session) plus completed items.
import { Link, useLoaderData } from "react-router";
import { useScenario } from "~/a11y/useScenario";
import portal from "~/data/generated/portal.json";
import { SITE_NOW, addDays } from "~/data/site";
import type { PortalStudent, TodoItem } from "~/data/types";
import { PortalPage, erpDate } from "./_PortalPage";
import { portalStore, updatePortal } from "./_store";

export { inventoryMeta as meta } from "~/routes/meta";

export async function loader() {
  const todos = (portal as unknown as PortalStudent).todos;
  const byDue = (a: TodoItem, b: TodoItem) => (a.due ?? "9").localeCompare(b.due ?? "9");
  return { open: todos.filter((t) => t.status === "open").sort(byDue), done: todos.filter((t) => t.status === "complete") };
}

export default function TodoPage() {
  const { open, done } = useLoaderData<typeof loader>();
  const dueFixed = useScenario("portal-todo-due-color-001");
  const { done: checked } = portalStore.use();
  const soon = addDays(SITE_NOW, 14);
  const toggle = (id: string) => updatePortal({ done: checked.includes(id) ? checked.filter((x) => x !== id) : [...checked, id] });
  const remaining = open.filter((t) => !checked.includes(t.id)).length;

  return (
    <PortalPage title="To-Do List" subtitle="Complete these items to avoid delays in registration or financial aid.">
      <section className="pt-card" aria-labelledby="todo-open">
        <h2 id="todo-open">Open Items ({remaining})</h2>
        <p className="pt-muted">Check off an item once you've finished it. Offices confirm items within two business days.</p>
        <ul className="pt-todo" data-a11y-scenario="portal-todo-due-color-001">
          {open.map((t) => {
            const isDone = checked.includes(t.id);
            const isSoon = !isDone && !!t.due && t.due <= soon;
            return (
              <li key={t.id} className={isDone ? "is-done" : undefined}>
                <span className="pt-todo-main">
                  <input type="checkbox" id={`todo-${t.id}`} checked={isDone} onChange={() => toggle(t.id)} />
                  <label htmlFor={`todo-${t.id}`}>{t.title}</label>
                  {" "}<Link to={t.url} className="pt-todo-link">Details<span className="visually-hidden">: {t.title}</span></Link>
                </span>
                <span className="pt-muted">{t.office}</span>
                {t.due && (
                  <span className={isSoon ? "pt-due pt-due--soon" : "pt-due"}>
                    {isDone ? "Done" : `Due ${erpDate(t.due)}`}{dueFixed && isSoon && <span className="pt-badge pt-badge--warn">Due soon</span>}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <section className="pt-card" aria-labelledby="todo-done">
        <h2 id="todo-done">Completed ({done.length})</h2>
        <ul className="pt-todo pt-todo--done">
          {done.map((t) => (
            <li key={t.id}><Link to={t.url}>{t.title}</Link><span className="pt-muted">{t.office}</span><span className="pt-due">Complete</span></li>
          ))}
        </ul>
      </section>
    </PortalPage>
  );
}
