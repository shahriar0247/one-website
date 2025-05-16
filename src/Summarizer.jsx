import React, { useState, useRef } from "react";

export default function Summarizer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamed, setStreamed] = useState("");
  const animationTimeouts = useRef([]);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setResult("");
    setStreamed("");
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];
    try {
      const res = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error("Failed to summarize");
      const reader = res.body.getReader();
      let decoder = new TextDecoder();
      let done = false;
      let accumulated = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setStreamed(accumulated);
        }
      }
      setResult(accumulated.trim());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Text Summarizer</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={10}
        style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc", marginBottom: 20 }}
      />
      <button onClick={handleSummarize} disabled={loading || !text.trim()} style={{ padding: "10px 24px", fontSize: 16, borderRadius: 6, background: "#1976d2", color: "#fff", border: "none", cursor: "pointer" }}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {error && <div style={{ color: "red", marginTop: 16 }}>{error}</div>}
      <div style={{ marginTop: 24, minHeight: 80 }}>
        {streamed && (
          <div style={{ background: "#f0f4fa", padding: 16, borderRadius: 8, minHeight: 60, fontSize: 17, whiteSpace: "pre-wrap", transition: "all 0.7s cubic-bezier(.4,2,.6,1)", animation: "fadeInUp 0.7s" }}>
            {streamed}
          </div>
        )}
        {result && !loading && (
          <div style={{ background: "#e3fcec", padding: 16, borderRadius: 8, marginTop: 16, boxShadow: "0 2px 8px #0001", transition: "all 1s" }}>
            <h3>Summary:</h3>
            <div style={{ whiteSpace: "pre-line", fontSize: 17 }}>{result}</div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}  