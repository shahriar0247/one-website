import React, { useState } from "react";

export default function GrammarChecker() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/grammar-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error("Failed to check grammar");
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Grammar Checker</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={10}
        style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc", marginBottom: 20 }}
      />
      <button onClick={handleCheck} disabled={loading || !text.trim()} style={{ padding: "10px 24px", fontSize: 16, borderRadius: 6, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer" }}>
        {loading ? "Checking..." : "Check Grammar"}
      </button>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24 }}>
          <h3>Suggestions:</h3>
          {result.matches && result.matches.length === 0 && <div style={{ color: "green" }}>No issues found!</div>}
          <ul>
            {result.matches && result.matches.map((match, idx) => (
              <li key={idx} style={{ marginBottom: 12 }}>
                <strong>Issue:</strong> {match.message}<br />
                <strong>Context:</strong> <code>{match.context.text}</code><br />
                {match.replacements && match.replacements.length > 0 && (
                  <span><strong>Suggestions:</strong> {match.replacements.map(r => r.value).join(", ")}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 