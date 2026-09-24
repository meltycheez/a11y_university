interface PaginationProps { page: number; pageCount: number; onChange: (page: number) => void; label?: string }

/** Baseline accessible pagination for client-side lists. */
export function Pagination({ page, pageCount, onChange, label = "Pagination" }: PaginationProps) {
  if (pageCount < 2) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav className="pagination" aria-label={label}>
      <ul>
        <li>
          <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>Previous</button>
        </li>
        {pages.map((p) => (
          <li key={p}>
            <button type="button" aria-current={p === page ? "page" : undefined} onClick={() => onChange(p)}>
              <span className="visually-hidden">Page </span>{p}
            </button>
          </li>
        ))}
        <li>
          <button type="button" disabled={page === pageCount} onClick={() => onChange(page + 1)}>Next</button>
        </li>
      </ul>
    </nav>
  );
}
