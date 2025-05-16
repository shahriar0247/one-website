import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

const FADE_OUT_DURATION = 5000; // ms
const FADE_IN_DURATION = 200; // ms

export default function Summarizer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [thinkParagraphs, setThinkParagraphs] = useState([]); // {key, text, visible}
  const [thinkKey, setThinkKey] = useState(0);
  const currentThinkKey = useRef(null);
  const fadeTimeouts = useRef({});

  useEffect(() => {
    return () => {
      Object.values(fadeTimeouts.current).forEach(clearTimeout);
      fadeTimeouts.current = {};
    };
  }, []);

  function startNewThinkParagraph() {
    const newKey = thinkKey + 1;
    setThinkKey(newKey);
    setThinkParagraphs(paragraphs => {
      // Fade out and remove only the first visible box (oldest)
      const idxToFade = paragraphs.findIndex(p => p.visible !== false);
      let updated = paragraphs;
      if (idxToFade !== -1) {
        const keyToFade = paragraphs[idxToFade].key;
        updated = paragraphs.map((p, idx) =>
          idx === idxToFade ? { ...p, visible: false } : p
        );
        fadeTimeouts.current[keyToFade] = setTimeout(() => {
          setThinkParagraphs(pars => pars.filter(pp => pp.key !== keyToFade));
        }, FADE_OUT_DURATION);
      }
      return [
        ...updated,
        { key: newKey, text: "", visible: false }
      ];
    });
    currentThinkKey.current = newKey;
    setTimeout(() => {
      setThinkParagraphs(paragraphs =>
        paragraphs.map(p =>
          p.key === newKey ? { ...p, visible: true } : p
        )
      );
    }, 10);
  }

  function fadeOutCurrentThinkParagraph() {
    const keyToFade = currentThinkKey.current;
    if (keyToFade !== null) {
      setThinkParagraphs(paragraphs =>
        paragraphs.map(p =>
          p.key === keyToFade ? { ...p, visible: false } : p
        )
      );
      fadeTimeouts.current[keyToFade] = setTimeout(() => {
        setThinkParagraphs(paragraphs =>
          paragraphs.filter(p => p.key !== keyToFade)
        );
      }, FADE_OUT_DURATION);
      currentThinkKey.current = null;
    }
  }

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setResult("");
    setThinkParagraphs([]);
    setThinkKey(0);
    currentThinkKey.current = null;
    Object.values(fadeTimeouts.current).forEach(clearTimeout);
    fadeTimeouts.current = {};
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
      let firstResult = true;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          chunk.split(/\n/).forEach(line => {
            if (!line.trim()) return;
            try {
              const obj = JSON.parse(line);
              if (obj.THINK_START || obj.THINK_PARAGRAPH) {
                startNewThinkParagraph();
              } else if (obj.THINK !== undefined) {
                if (currentThinkKey.current === null) {
                  startNewThinkParagraph();
                }
                setThinkParagraphs(paragraphs =>
                  paragraphs.map((p, idx, arr) =>
                    p.key === currentThinkKey.current && idx === arr.length - 1
                      ? { ...p, text: p.text + obj.THINK }
                      : p
                  )
                );
              } else if (obj.THINK_END) {
                fadeOutCurrentThinkParagraph();
              } else if (obj.RESULT !== undefined) {
                let char = obj.RESULT;
                if (firstResult && /\s/.test(char)) return;
                firstResult = false;
                accumulated += char;
                setResult(accumulated);
              }
            } catch (e) {}
          });
        }
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      Object.values(fadeTimeouts.current).forEach(clearTimeout);
      fadeTimeouts.current = {};
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
          <div style={{ position: 'relative', minHeight: 60 }}>
            {thinkParagraphs.map(p => (
              <div
                key={p.key}
                className={p.visible ? "think-para fade-in-fast" : "think-para fade-out-fast"}
                style={{
                  background: "#fffbe6",
                  padding: 16,
                  borderRadius: 10,
                  fontSize: 16,
                  color: '#7a5d00',
                  boxShadow: '0 2px 8px #0001',
                  marginBottom: 16,
                  width: '100%',
                  zIndex: 2,
                  opacity: p.visible ? 1 : 0,
                  transition: p.visible
                    ? `opacity ${FADE_IN_DURATION}ms cubic-bezier(.4,0,.2,1)`
                    : `opacity ${FADE_OUT_DURATION}ms cubic-bezier(.4,0,.2,1)`
                }}
              >
                <ReactMarkdown>{p.text}</ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
        {/* RESULT BOX */}
        <div style={{ flex: 2, minWidth: 320 }}>
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#1976d2', fontSize: 18 }}>Summary</div>
          <div style={{ background: "#f0f4fa", padding: 18, borderRadius: 10, minHeight: 80, fontSize: 17, boxShadow: "0 2px 8px #0001", whiteSpace: "pre-wrap", transition: "all 0.7s cubic-bezier(.4,2,.6,1)" }}>
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}  