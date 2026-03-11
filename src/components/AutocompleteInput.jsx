import { useState, useRef } from "react";

export default function AutocompleteInput({ label, options, value, onChange, placeholder }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const filtered = options
    .filter((o) => o.toLowerCase().includes(value.toLowerCase()))
    .slice(0, 8);

  const showAddNew =
    value.trim() &&
    filtered.length === 0 &&
    !options.some((o) => o.toLowerCase() === value.trim().toLowerCase());

  function select(item) {
    onChange(item);
    setShowSuggestions(false);
  }

  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
      />
      {showSuggestions && (filtered.length > 0 || showAddNew) && (
        <div className="suggestions">
          {filtered.map((item) => (
            <div key={item} onMouseDown={() => select(item)}>
              {item}
            </div>
          ))}
          {showAddNew && (
            <div
              onMouseDown={() => select(value.trim())}
              style={{ color: "var(--accent)", fontWeight: 600 }}
            >
              + Add "{value.trim()}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
