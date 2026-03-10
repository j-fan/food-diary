import { useState } from "react";

function formatDate(datetime) {
  const d = new Date(datetime);
  return d.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatTime(datetime) {
  const d = new Date(datetime);
  return d.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function groupByDate(entries) {
  const groups = {};
  for (const entry of entries) {
    const dateKey = entry.datetime.split("T")[0];
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(entry);
  }
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
}

export default function EntryList({ entries, onEdit, onDelete }) {
  const [filter, setFilter] = useState("");
  const [deleting, setDeleting] = useState(null);

  const filtered = filter
    ? entries.filter((e) => e.person.toLowerCase() === filter.toLowerCase())
    : entries;

  const people = [...new Set(entries.map((e) => e.person))];
  const grouped = groupByDate(filtered);

  if (entries.length === 0) {
    return (
      <div className="card text-center">
        <p style={{ color: "var(--text-light)" }}>No entries yet. Add your first meal!</p>
      </div>
    );
  }

  return (
    <>
      {people.length > 1 && (
        <div className="mb-8">
          <span
            className={`chip ${filter === "" ? "active" : ""}`}
            onClick={() => setFilter("")}
          >
            all
          </span>
          {people.map((p) => (
            <span
              key={p}
              className={`chip ${filter === p ? "active" : ""}`}
              onClick={() => setFilter(p)}
            >
              {p}
            </span>
          ))}
        </div>
      )}

      {grouped.map(([date, dayEntries]) => (
        <div key={date} className="card">
          <h2>{formatDate(dayEntries[0].datetime)}</h2>
          {dayEntries.map((entry) => (
            <div key={entry.id} className="entry-row">
              <div style={{ flex: 1 }} onClick={() => onEdit(entry)}>
                <strong>
                  {entry.mealType}
                  {entry.person !== "me" && ` (${entry.person})`}
                </strong>
                <div style={{ fontSize: "0.95rem" }}>
                  {entry.ingredients.join(", ")}
                </div>
                {entry.symptoms.length > 0 && (
                  <div style={{ fontSize: "0.9rem", color: "var(--accent)" }}>
                    {entry.symptoms.join(", ")}
                  </div>
                )}
                {entry.notes && (
                  <div style={{ fontSize: "0.85rem", color: "var(--text-light)", fontStyle: "italic" }}>
                    {entry.notes}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className="entry-meta">{formatTime(entry.datetime)}</div>
                {deleting === entry.id ? (
                  <div className="mt-8">
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => { onDelete(entry.id); setDeleting(null); }}
                    >
                      confirm
                    </button>
                    <button
                      className="btn btn-small"
                      style={{ marginLeft: 4 }}
                      onClick={() => setDeleting(null)}
                    >
                      cancel
                    </button>
                  </div>
                ) : (
                  <div className="entry-actions mt-8">
                    <button className="btn btn-small" onClick={() => onEdit(entry)}>edit</button>
                    <button
                      className="btn btn-small btn-danger"
                      style={{ marginLeft: 4 }}
                      onClick={() => setDeleting(entry.id)}
                    >
                      delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
