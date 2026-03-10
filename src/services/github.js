const REPO_OWNER = "j-fan";
const REPO_NAME = "food-diary";
const API = "https://api.github.com";

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
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
    { headers: headers() }
  );
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  const data = await res.json();
  const content = JSON.parse(atob(data.content));
  return { content, sha: data.sha };
}

async function putFile(path, content, sha, message) {
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
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
  return getFile("data/entries.json");
}

export async function saveEntries(entries, sha) {
  return putFile("data/entries.json", entries, sha, "Update entries");
}

export async function loadIngredients() {
  return getFile("data/ingredients.json");
}

export async function saveIngredients(ingredients, sha) {
  return putFile("data/ingredients.json", ingredients, sha, "Update ingredients");
}

export async function loadSymptoms() {
  return getFile("data/symptoms.json");
}

export async function saveSymptoms(symptoms, sha) {
  return putFile("data/symptoms.json", symptoms, sha, "Update symptoms");
}

export async function loadPeople() {
  return getFile("data/people.json");
}

export async function savePeople(people, sha) {
  return putFile("data/people.json", people, sha, "Update people");
}

export async function testToken() {
  const res = await fetch(
    `${API}/repos/${REPO_OWNER}/${REPO_NAME}`,
    { headers: headers() }
  );
  return res.ok;
}
