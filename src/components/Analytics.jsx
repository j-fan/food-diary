import { useMemo, useState } from "react";

export default function Analytics({ entries }) {
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const { symptomCounts, foodBySymptom } = useMemo(() => {
    const symptomCounts = {};
    const foodBySymptom = {};

    for (const entry of entries) {
      for (const symptom of entry.symptoms) {
        if (symptom === "none") continue;
        symptomCounts[symptom] = (symptomCounts[symptom] || 0) + 1;
        if (!foodBySymptom[symptom]) foodBySymptom[symptom] = {};
        for (const ingredient of entry.ingredients) {
          foodBySymptom[symptom][ingredient] =
            (foodBySymptom[symptom][ingredient] || 0) + 1;
        }
      }
    }

    return { symptomCounts, foodBySymptom };
  }, [entries]);

  const symptomList = Object.entries(symptomCounts).sort(
    ([, a], [, b]) => b - a
  );

  const active = selectedSymptom || (symptomList.length > 0 ? symptomList[0][0] : null);

  const foodList = active
    ? Object.entries(foodBySymptom[active]).sort(([, a], [, b]) => b - a)
    : [];

  const maxCount = foodList.length > 0 ? foodList[0][1] : 1;

  if (entries.length === 0) {
    return (
      <div className="card text-center">
        <p style={{ color: "var(--text-light)" }}>No entries yet.</p>
      </div>
    );
  }

  if (symptomList.length === 0) {
    return (
      <div className="card text-center">
        <p style={{ color: "var(--text-light)" }}>
          No symptoms recorded yet. Keep tracking!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h2>Symptoms</h2>
        <div className="mb-8">
          {symptomList.map(([symptom, count]) => (
            <span
              key={symptom}
              className={`chip ${active === symptom ? "active" : ""}`}
              onClick={() => setSelectedSymptom(symptom)}
            >
              {symptom} ({count})
            </span>
          ))}
        </div>
      </div>

      {active && foodList.length > 0 && (
        <div className="card">
          <h2>Foods with {active}</h2>
          {foodList.map(([food, count]) => (
            <div key={food} className="bar-row">
              <span className="bar-label">{food}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="bar-count">{count}</span>
            </div>
          ))}
        </div>
      )}

</>
  );
}
