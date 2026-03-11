const REPO_OWNER = "j-fan";
const DATA_REPO = "food-diary-data";
const API = "https://api.github.com";

const DEMO_DATA = {
  "entries.json": [
    { id: "d1", datetime: "2026-03-11T08:00", person: "Alice", mealType: "breakfast", ingredients: ["eggs", "toast", "avocado"], symptoms: ["bloating"], notes: "" },
    { id: "d2", datetime: "2026-03-10T12:30", person: "Bob", mealType: "lunch", ingredients: ["chicken", "rice", "broccoli"], symptoms: [], notes: "Felt good" },
    { id: "d3", datetime: "2026-03-10T19:00", person: "Alice", mealType: "dinner", ingredients: ["salmon", "pasta", "garlic"], symptoms: ["headache"], notes: "" },
  ],
  "ingredients.json": ["avocado", "broccoli", "chicken", "eggs", "garlic", "pasta", "rice", "salmon", "toast"],
  "symptoms.json": ["bloating", "cramps", "fatigue", "headache", "nausea"],
  "people.json": ["Alice", "Bob", "Charlie"],
};

function isDemo() {
  return getToken() === "demo";
}

function getToken() {
  return localStorage.getItem("github_pat");
}

function headers() {
  return {
    Authorization: `Bearer ${getToken()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function getFile(path) {
  if (isDemo()) {
    return { content: structuredClone(DEMO_DATA[path]), sha: "demo-sha" };
  }
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${DATA_REPO}/contents/${path}`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  const data = await res.json();
  const content = JSON.parse(atob(data.content));
  return { content, sha: data.sha };
}

async function putFile(path, content, sha, message) {
  if (isDemo()) {
    DEMO_DATA[path] = content;
    return { content: { sha: "demo-sha-" + Date.now() } };
  }
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${DATA_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({
        message,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2) + "\n"))),
        sha,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to update ${path}: ${err.message}`);
  }
  return res.json();
}

export async function loadEntries() {
  return getFile("entries.json");
}

export async function saveEntries(entries, sha) {
  return putFile("entries.json", entries, sha, "Update entries");
}

export async function loadIngredients() {
  return getFile("ingredients.json");
}

export async function saveIngredients(ingredients, sha) {
  return putFile("ingredients.json", ingredients, sha, "Update ingredients");
}

export async function loadSymptoms() {
  return getFile("symptoms.json");
}

export async function saveSymptoms(symptoms, sha) {
  return putFile("symptoms.json", symptoms, sha, "Update symptoms");
}

export async function loadPeople() {
  return getFile("people.json");
}

export async function savePeople(people, sha) {
  return putFile("people.json", people, sha, "Update people");
}

export async function testToken() {
  if (isDemo()) return true;
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${DATA_REPO}`,
    { headers: headers() }
  );
  return res.ok;
}
