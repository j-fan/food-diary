import { useState, useEffect, useCallback } from "react";
import { testToken, loadEntries, loadIngredients, loadSymptoms, loadPeople, saveEntries } from "./services/github";
import LoginScreen from "./components/LoginScreen";
import EntryForm from "./components/EntryForm";
import EntryList from "./components/EntryList";

export default function App() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("github_pat"));
  const [view, setView] = useState("list"); // "list" | "add" | "edit"
  const [editEntry, setEditEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const [entriesSha, setEntriesSha] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [ingredientsSha, setIngredientsSha] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [symptomsSha, setSymptomsSha] = useState(null);
  const [people, setPeople] = useState([]);
  const [peopleSha, setPeopleSha] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [e, i, s, p] = await Promise.all([
        loadEntries(),
        loadIngredients(),
        loadSymptoms(),
        loadPeople(),
      ]);
      setEntries(e.content);
      setEntriesSha(e.sha);
      setIngredients(i.content);
      setIngredientsSha(i.sha);
      setSymptoms(s.content);
      setSymptomsSha(s.sha);
      setPeople(p.content);
      setPeopleSha(p.sha);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  async function handleLogin(token) {
    localStorage.setItem("github_pat", token);
    const ok = await testToken();
    if (ok) {
      setAuthed(true);
    } else {
      localStorage.removeItem("github_pat");
      throw new Error("Invalid token or no access to repo");
    }
  }

  function handleLogout() {
    localStorage.removeItem("github_pat");
    setAuthed(false);
    setEntries([]);
  }

  function handleFormSaved(updates) {
    setEntries(updates.entries);
    setEntriesSha(updates.entriesSha);
    if (updates.ingredients) {
      setIngredients(updates.ingredients);
      setIngredientsSha(updates.ingredientsSha);
    }
    if (updates.symptoms) {
      setSymptoms(updates.symptoms);
      setSymptomsSha(updates.symptomsSha);
    }
    if (updates.people) {
      setPeople(updates.people);
      setPeopleSha(updates.peopleSha);
    }
    setEditEntry(null);
    setView("list");
  }

  async function handleDelete(id) {
    const newEntries = entries.filter((e) => e.id !== id);
    try {
      const result = await saveEntries(newEntries, entriesSha);
      setEntries(newEntries);
      setEntriesSha(result.content.sha);
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  }

  function handleEdit(entry) {
    setEditEntry(entry);
    setView("edit");
  }

  if (!authed) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const showForm = view === "add" || view === "edit";

  return (
    <div className="container">
      <h1>Food Diary</h1>

      <div className="tabs">
        <div
          className={`tab ${view === "list" ? "active" : ""}`}
          onClick={() => { setView("list"); setEditEntry(null); }}
        >
          Entries
        </div>
        <div
          className={`tab ${showForm ? "active" : ""}`}
          onClick={() => { setView("add"); setEditEntry(null); }}
        >
          + Add
        </div>
      </div>

      {error && <div className="status error">{error}</div>}
      {loading && <div className="status">Loading...</div>}

      {!loading && showForm && (
        <EntryForm
          key={editEntry ? editEntry.id : "new"}
          entries={entries}
          entriesSha={entriesSha}
          ingredients={ingredients}
          ingredientsSha={ingredientsSha}
          symptoms={symptoms}
          symptomsSha={symptomsSha}
          people={people}
          peopleSha={peopleSha}
          editEntry={editEntry}
          onSaved={handleFormSaved}
          onCancel={() => { setEditEntry(null); setView("list"); }}
        />
      )}

      {!loading && view === "list" && (
        <>
          <EntryList entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
          <div className="text-center mt-16">
            <button className="btn btn-small" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
