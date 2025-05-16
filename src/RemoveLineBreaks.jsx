import React, { useState } from "react";

export default function RemoveLineBreaks() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  // Remove only line breaks (\r, \n), keep spaces as-is
  const handleRemoveBreaks = () => {
    setResult(text.replace(/[\r\n]+/g, " "));
  };
  // Remove only extra spaces (multiple spaces to one), keep line breaks as-is
  const handleRemoveExtraSpaces = () => {
    setResult(text.replace(/ {2,}/g, " "));
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Remove Line Breaks Tool</h2>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={8}
        style={{ width: "100%", padding: 12, fontSize: 16, borderRadius: 6, border: "1px solid #ccc", marginBottom: 20 }}
      />
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={handleRemoveBreaks} style={btnStyle}>Remove Line Breaks</button>
        <button onClick={handleRemoveExtraSpaces} style={btnStyle}>Remove Extra Spaces</button>
      </div>
      {result && (
        <div style={{ marginTop: 16 }}>
          <h3>Cleaned Text:</h3>
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