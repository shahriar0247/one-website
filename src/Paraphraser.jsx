import React, { useState } from "react";

export default function Paraphraser() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleParaphrase = async () => {
    setLoading(true);
    setError(null);
    setResult("");
    try {
      const res = await fetch("http://localhost:5000/api/paraphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error("Failed to paraphrase");
      const data = await res.json();
      setResult(data.result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Paraphrasing Tool</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={10}
        style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc", marginBottom: 20 }}
      />
      <button onClick={handleParaphrase} disabled={loading || !text.trim()} style={{ padding: "10px 24px", fontSize: 16, borderRadius: 6, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer" }}>
        {loading ? "Paraphrasing..." : "Paraphrase"}
      </button>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24 }}>
          <h3>Paraphrased Text:</h3>
          <div style={{ background: "#f0f4fa", padding: 16, borderRadius: 8 }}>{result}</div>
        </div>
      )}
    </div>
  );
}  