import React, { useState } from "react";

function countStats(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;
  const characters = text.length;
  return { words, sentences, paragraphs, characters };
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const stats = countStats(text);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Word & Sentence Counter</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={10}
        style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc", marginBottom: 20 }}
      />
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 16 }}>
        <Stat label="Words" value={stats.words} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Characters" value={stats.characters} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ minWidth: 100, background: "#f0f4fa", borderRadius: 8, padding: 16, textAlign: "center", boxShadow: "0 1px 4px #0001" }}>
      <div style={{ fontSize: 28, fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: 14, color: "#555" }}>{label}</div>
    </div>
  );
}  