export interface Column<T> { key: string; header: string; render: (row: T) => React.ReactNode; numeric?: boolean }

/** Baseline accessible data table with caption and scoped headers. */
export function DataTable<T>({ caption, columns, rows, rowHeader }: { caption: string; columns: Column<T>[]; rows: T[]; rowHeader?: string }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className={c.numeric ? "num" : undefined}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) =>
                c.key === rowHeader ? (
                  <th key={c.key} scope="row">{c.render(row)}</th>
                ) : (
                  <td key={c.key} className={c.numeric ? "num" : undefined}>{c.render(row)}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
