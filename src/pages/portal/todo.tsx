// /portal/todo: open and completed to-do items.
import { Link, useLoaderData } from "react-router";
import { useScenario } from "~/a11y/useScenario";
import portal from "~/data/generated/portal.json";
import { SITE_NOW, addDays } from "~/data/site";
import type { PortalStudent, TodoItem } from "~/data/types";
import { PortalPage, erpDate } from "./_PortalPage";

export { inventoryMeta as meta } from "~/routes/meta";

export async function loader() {
  const todos = (portal as unknown as PortalStudent).todos;
  const byDue = (a: TodoItem, b: TodoItem) => (a.due ?? "9").localeCompare(b.due ?? "9");
  return { open: todos.filter((t) => t.status === "open").sort(byDue), done: todos.filter((t) => t.status === "complete") };
}

export default function TodoPage() {
  const { open, done } = useLoaderData<typeof loader>();
  const dueFixed = useScenario("portal-todo-due-color-001");
  const soon = addDays(SITE_NOW, 14);

  return (
    <PortalPage title="To-Do List" subtitle="Complete these items to avoid delays in registration or financial aid.">
      <section className="pt-card" aria-labelledby="todo-open">
        <h2 id="todo-open">Open Items ({open.length})</h2>
        <ul className="pt-todo" data-a11y-scenario="portal-todo-due-color-001">
          {open.map((t) => {
            const isSoon = !!t.due && t.due <= soon;
            return (
              <li key={t.id}>
                <Link to={t.url}>{t.title}</Link>
                <span className="pt-muted">{t.office}</span>
                {t.due && (
                  <span className={isSoon ? "pt-due pt-due--soon" : "pt-due"}>
                    Due {erpDate(t.due)}{dueFixed && isSoon && <span className="pt-badge pt-badge--warn">Due soon</span>}
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
