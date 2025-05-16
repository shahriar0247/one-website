import React, { useState } from "react";

function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}
function toSentenceCase(str) {
  return str.replace(/(^|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
}

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const handleConvert = (type) => {
    let converted = text;
    if (type === "upper") converted = text.toUpperCase();
    else if (type === "lower") converted = text.toLowerCase();
    else if (type === "title") converted = toTitleCase(text);
    else if (type === "sentence") converted = toSentenceCase(text.toLowerCase());
    setResult(converted);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Case Converter</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={8}
        style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc", marginBottom: 20 }}
      />
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={() => handleConvert("upper")} style={btnStyle}>UPPERCASE</button>
        <button onClick={() => handleConvert("lower")} style={btnStyle}>lowercase</button>
        <button onClick={() => handleConvert("title")} style={btnStyle}>Title Case</button>
        <button onClick={() => handleConvert("sentence")} style={btnStyle}>Sentence case</button>
      </div>
      {result && (
        <div style={{ marginTop: 16 }}>
          <h3>Converted Text:</h3>
          <div style={{ background: "#f0f4fa", padding: 16, borderRadius: 8, whiteSpace: "pre-line" }}>{result}</div>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  padding: "8px 18px",
  fontSize: 15,
  borderRadius: 6,
  background: "#1976d2",
  color: "#fff",
  border: "none",
  cursor: "pointer"
};  