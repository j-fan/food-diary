import { useState, useRef } from "react";

export default function TagInput({ label, options, selected, onChange, placeholder }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  const filtered = options
    .filter(
      (o) =>
        o.toLowerCase().includes(query.toLowerCase()) &&
        !selected.includes(o)
    )
    .slice(0, 8);

  const showAddNew =
    query.trim() &&
    filtered.length === 0 &&
    !options.some((o) => o.toLowerCase() === query.trim().toLowerCase()) &&
    !selected.includes(query.trim().toLowerCase());

  function add(item) {
    onChange([...selected, item]);
    setQuery("");
    setShowSuggestions(false);
  }

  function remove(item) {
    onChange(selected.filter((s) => s !== item));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered.length > 0) {
        add(filtered[0]);
      } else if (showAddNew) {
        add(query.trim().toLowerCase());
      }
    }
  }

  return (
    <div className="form-group" ref={wrapperRef}>
      <label>{label}</label>
      <div>
        {selected.map((item) => (
          <span key={item} className="chip active">
            {item}
            <span className="remove" onClick={() => remove(item)}>
              x
            </span>
          </span>
        ))}
      </div>
      <input
        type="text"
        placeholder={placeholder || "Type to search..."}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onKeyDown={handleKeyDown}
      />
      {showSuggestions && (filtered.length > 0 || showAddNew) && (
        <div className="suggestions">
          {filtered.map((item) => (
            <div key={item} onMouseDown={() => add(item)}>
              {item}
            </div>
          ))}
          {showAddNew && (
            <div
              onMouseDown={() => add(query.trim().toLowerCase())}
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              + Add "{query.trim()}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
