import { useState } from "react";
import { saveEntries, saveIngredients, saveSymptoms, savePeople } from "../services/github";
import TagInput from "./TagInput";
import AutocompleteInput from "./AutocompleteInput";

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

function toLocalDatetime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function EntryForm({
  entries,
  entriesSha,
  ingredients,
  ingredientsSha,
  symptoms,
  symptomsSha,
  people,
  peopleSha,
  editEntry,
  onSaved,
  onCancel,
}) {
  const [datetime, setDatetime] = useState(
    editEntry ? editEntry.datetime : toLocalDatetime(new Date())
  );
  const [person, setPerson] = useState(editEntry ? editEntry.person : "");
  const [mealType, setMealType] = useState(editEntry ? editEntry.mealType : "lunch");
  const [selectedIngredients, setSelectedIngredients] = useState(
    editEntry ? editEntry.ingredients : []
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState(
    editEntry ? editEntry.symptoms : []
  );
  const [notes, setNotes] = useState(editEntry ? editEntry.notes : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!editEntry;

  async function handleSubmit(e) {
    e.preventDefault();
    if (selectedIngredients.length === 0) {
      setError("Add at least one ingredient");
      return;
    }

    setSaving(true);
    setError(null);

    const personName = person.trim() || people[0] || "me";

    const entry = {
      id: isEditing ? editEntry.id : Date.now().toString(36),
      datetime,
      person: personName,
      mealType,
      ingredients: selectedIngredients,
      symptoms: selectedSymptoms,
      notes: notes.trim(),
    };

    try {
      const newEntries = isEditing
        ? entries.map((e) => (e.id === editEntry.id ? entry : e))
        : [entry, ...entries];
      const result = await saveEntries(newEntries, entriesSha);

      const updates = {
        entries: newEntries,
        entriesSha: result.content.sha,
      };

      // Save new ingredients if any were added
      const newIngredientItems = selectedIngredients.filter(
        (i) => !ingredients.includes(i)
      );
      if (newIngredientItems.length > 0) {
        const merged = [...ingredients, ...newIngredientItems].sort();
        const res = await saveIngredients(merged, ingredientsSha);
        updates.ingredients = merged;
        updates.ingredientsSha = res.content.sha;
      }

      // Save new symptoms if any were added
      const newSymptomItems = selectedSymptoms.filter(
        (s) => !symptoms.includes(s)
      );
      if (newSymptomItems.length > 0) {
        const merged = [...symptoms, ...newSymptomItems].sort();
        const res = await saveSymptoms(merged, symptomsSha);
        updates.symptoms = merged;
        updates.symptomsSha = res.content.sha;
      }

      // Save new person if not already in the list
      if (!people.some((p) => p.toLowerCase() === personName.toLowerCase())) {
        const merged = [...people, personName].sort();
        const res = await savePeople(merged, peopleSha);
        updates.people = merged;
        updates.peopleSha = res.content.sha;
      }

      onSaved(updates);
    } catch (err) {
      setError("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="card">
        <div className="form-group">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
          />
        </div>

        <AutocompleteInput
          label="Person"
          options={people}
          value={person}
          onChange={setPerson}
          placeholder={people[0] || "Name..."}
        />

        <div className="form-group">
          <label>Meal</label>
          <div className="meal-types">
            {MEAL_TYPES.map((type) => (
              <span
                key={type}
                className={`chip ${mealType === type ? "active" : ""}`}
                onClick={() => setMealType(type)}
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <TagInput
          label="Ingredients"
          options={ingredients}
          selected={selectedIngredients}
          onChange={setSelectedIngredients}
          placeholder="Search or add ingredient..."
        />

        <TagInput
          label="Symptoms"
          options={symptoms}
          selected={selectedSymptoms}
          onChange={setSelectedSymptoms}
          placeholder="Search or add symptom..."
        />

        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extra notes..."
          />
        </div>

        {error && <div className="status error mb-8">{error}</div>}

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Update Entry" : "Save Entry"}
          </button>
          {isEditing && (
            <button className="btn" type="button" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
