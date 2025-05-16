import React, { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

function decodeHTMLEntities(str) {
  // Handles \u003c and \u003e and others
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (m, code) => String.fromCharCode(parseInt(code, 16)));
}

export default function Summarizer() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [thinking, setThinking] = useState(null); // {id, text, visible}
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const thinkId = useRef(0);

  // Replace the think bubble text
  function replaceThinkBubble(newText) {
    thinkId.current += 1;
    setThinking({ id: thinkId.current, text: newText, visible: true });
  }

  // Update the current think bubble's text (letter by letter)
  function updateThinkText(char) {
    setThinking(prev => prev ? { ...prev, text: prev.text + char } : null);
  }

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setSummary("");
    setThinking(null);
    thinkId.current = 0;
    try {
      const ollamaUrl = "http://localhost:11434/api/generate";
      const model = "deepseek-r1:1.5b";
      const prompt = `Summarize the following text in a few bullet points or key sentences. If you need to think step by step, enclose your thoughts in <think>...</think> tags. Only put the final summary outside <think> tags.\n\n${text}`;
      const res = await fetch(ollamaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt, stream: true })
      });
      if (!res.ok) throw new Error("Failed to connect to Ollama");
      const reader = res.body.getReader();
      let decoder = new TextDecoder();
      let doneReading = false;
      let inThink = false;
      let thinkBuffer = "";
      let summaryBuffer = "";
      let thinkParagraph = "";
      let lastChar = "";
      let afterThink = false;
      let startedWithThink = false;
      let firstNonWhitespaceSeen = false;
      let thinkTagStarted = false;
      while (!doneReading) {
        const { value, done } = await reader.read();
        doneReading = done;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          chunk.split(/\n/).forEach(line => {
            if (!line.trim()) return;
            try {
              const obj = JSON.parse(line);
              if (obj.response !== undefined) {
                let chars = decodeHTMLEntities(obj.response);
                for (let i = 0; i < chars.length; ++i) {
                  const c = chars[i];
                  if (!firstNonWhitespaceSeen && /\S/.test(c)) {
                    firstNonWhitespaceSeen = true;
                    if (c === '<' && chars.slice(i, i+6) === '<think>') {
                      startedWithThink = true;
                      thinkTagStarted = true;
                    }
                  }
                  thinkBuffer += c;
                  if (!inThink && thinkBuffer.endsWith('<think>')) {
                    inThink = true;
                    thinkBuffer = "";
                    thinkParagraph = "";
                    afterThink = false;
                    thinkTagStarted = false;
                  } else if (inThink && thinkBuffer.endsWith('</think>')) {
                    if (thinkParagraph.trim()) {
                      replaceThinkBubble(thinkParagraph);
                    }
                    inThink = false;
                    thinkBuffer = "";
                    thinkParagraph = "";
                    afterThink = true;
                  } else if (inThink) {
                    if (
                      thinkBuffer.endsWith('\n\n') ||
                      (lastChar === '\n' && c === '\n')
                    ) {
                      const para = thinkParagraph.replace(/\n+$/, "");
                      if (para.trim()) {
                        replaceThinkBubble(para);
                      }
                      thinkParagraph = "";
                      thinkBuffer = "";
                    } else {
                      thinkParagraph += c;
                      updateThinkText(c);
                    }
                  } else if (!inThink) {
                    if (afterThink) {
                      if (c === '\n') {
                      } else {
                        afterThink = false;
                        if (!(startedWithThink && !summaryBuffer.trim() && (c === '<' || thinkTagStarted))) {
                          summaryBuffer += c;
                        }
                        thinkTagStarted = false;
                      }
                    } else {
                      if (!(startedWithThink && !summaryBuffer.trim() && (c === '<' || thinkTagStarted))) {
                        summaryBuffer += c;
                      }
                      thinkTagStarted = false;
                    }
                  }
                  lastChar = c;
                }
                setSummary(summaryBuffer);
              }
            } catch (e) {}
          });
        }
      }
      let cleanSummary = summaryBuffer
        .replace(/<think>[\s\S]*?<\/think>/gi, '')
        .replace(/<\/?think>/gi, '')
        .replace(/^[-\s]+|[-\s]+$/g, '')
        .trim();
      setSummary(cleanSummary);
      setThinking(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
      <Typography variant="h4" style={{ fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>
        AI Text Summarizer
      </Typography>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        rows={8}
        disabled={loading}
        style={{ width: '100%', minHeight: 120, fontSize: '1.1rem', padding: 12, borderRadius: 6, border: '1.5px solid #cbd5e1', background: '#f8fafc', marginBottom: 16, resize: 'vertical', boxSizing: 'border-box' }}
      />
      <Button
        onClick={handleSummarize}
        disabled={loading || !text.trim()}
        variant="contained"
        size="large"
        style={{ width: '100%', fontWeight: 700, fontSize: '1.1rem', borderRadius: 6, marginBottom: 16 }}
      >
        {loading ? "Summarizing..." : "Summarize"}
      </Button>
      {error && <Paper style={{ color: '#dc2626', background: '#fef2f2', borderRadius: 6, padding: 10, marginBottom: 12, textAlign: 'center' }}>{error}</Paper>}
      {thinking && (
        <Paper style={{ background: '#f3f4f6', color: '#6d28d9', borderRadius: 10, padding: 18, marginBottom: 16 }}>
          <ReactMarkdown>{thinking.text}</ReactMarkdown>
        </Paper>
      )}
      {summary && (
        <Paper style={{ background: '#fff', color: '#1e293b', borderRadius: 10, padding: 24, marginTop: 12 }}>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </Paper>
      )}
    </div>
  );
}  