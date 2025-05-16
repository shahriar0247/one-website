import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function Summarizer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [streamed, setStreamed] = useState("");
  const [think, setThink] = useState("");
  const [thinkKey, setThinkKey] = useState(0);
  const thinkTimeout = useRef(null);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setResult("");
    setStreamed("");
    setThink("");
    setThinkKey(0);
    if (thinkTimeout.current) clearTimeout(thinkTimeout.current);
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
      let thinkQueue = [];
      let thinkActive = false;
      let thinkParagraph = "";
      let thinkParagraphKey = 0;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          // Parse lines for THINK: and RESULT:
          chunk.split(/\n/).forEach(line => {
            if (line.startsWith("THINK:")) {
              const thinkText = line.replace(/^THINK:/, "").trim();
              if (thinkText) thinkQueue.push(thinkText);
            } else if (line.startsWith("RESULT:")) {
              const resultText = line.replace(/^RESULT:/, "");
              accumulated += resultText;
              setStreamed(accumulated);
            }
          });
          // Show next think paragraph if not already showing
          if (!thinkActive && thinkQueue.length > 0) {
            thinkActive = true;
            const showNextThink = () => {
              if (thinkQueue.length === 0) {
                setThink("");
                thinkActive = false;
                return;
              }
              thinkParagraph = thinkQueue.shift();
              thinkParagraphKey++;
              setThink(thinkParagraph);
              setThinkKey(thinkParagraphKey);
              thinkTimeout.current = setTimeout(() => {
                setThink("");
                setTimeout(() => {
                  showNextThink();
                }, 400); // fade out before next
              }, 5000);
            };
            showNextThink();
          }
        }
      }
      setResult(accumulated.trim());
      setThink("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      if (thinkTimeout.current) clearTimeout(thinkTimeout.current);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
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
      <div style={{ marginTop: 32, display: 'flex', gap: 32, alignItems: 'flex-start', minHeight: 120 }}>
        {/* THINK BOX */}
        <div style={{ flex: 1, minWidth: 220, maxWidth: 320, position: 'relative', minHeight: 80 }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#1976d2', fontSize: 18 }}>AI is thinking...</div>
          <div key={thinkKey} className={think ? "think-para fade-in" : "think-para fade-out"} style={{
            background: "#fffbe6",
            padding: 16,
            borderRadius: 10,
            minHeight: 60,
            fontSize: 16,
            color: '#7a5d00',
            boxShadow: '0 2px 8px #0001',
            opacity: think ? 1 : 0,
            transition: 'opacity 0.5s, transform 0.5s',
            transform: think ? 'translateY(0)' : 'translateY(30px)',
            position: 'absolute',
            width: '100%',
            zIndex: 2
          }}>
            <ReactMarkdown>{think}</ReactMarkdown>
          </div>
        </div>
        {/* RESULT BOX */}
        <div style={{ flex: 2, minWidth: 320 }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#1976d2', fontSize: 18 }}>Summary</div>
          <div style={{ background: "#f0f4fa", padding: 18, borderRadius: 10, minHeight: 80, fontSize: 17, boxShadow: "0 2px 8px #0001", whiteSpace: "pre-wrap", transition: "all 0.7s cubic-bezier(.4,2,.6,1)" }}>
            <ReactMarkdown>{streamed}</ReactMarkdown>
          </div>
        </div>
      </div>
      <style>{`
        .fade-in { opacity: 1; transform: translateY(0); }
        .fade-out { opacity: 0; transform: translateY(30px); }
      `}</style>
    </div>
  );
}  