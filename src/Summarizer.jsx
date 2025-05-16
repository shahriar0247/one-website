import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import './Summarizer.css'; // We'll create this for custom styles/animations

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
  const [done, setDone] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const thinkId = useRef(0);
  const fadeTimeout = useRef(null);

  useEffect(() => {
    if (!loading) setDone(false);
    return () => {
      if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
    };
  }, [loading]);

  // Fade out and replace the think bubble
  function replaceThinkBubble(newText) {
    if (thinking && thinking.visible) {
      setThinking(prev => prev ? { ...prev, visible: false } : null);
      fadeTimeout.current = setTimeout(() => {
        thinkId.current += 1;
        setThinking({ id: thinkId.current, text: newText, visible: true });
      }, 400); // match fade-out duration in CSS
    } else {
      thinkId.current += 1;
      setThinking({ id: thinkId.current, text: newText, visible: true });
    }
    setShowPlaceholder(false);
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
    setDone(false);
    setShowPlaceholder(true);
    setShowResult(false);
    thinkId.current = 0;
    if (fadeTimeout.current) clearTimeout(fadeTimeout.current);
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
      // Streaming state
      let inThink = false;
      let thinkBuffer = "";
      let summaryBuffer = "";
      let thinkParagraph = "";
      let lastChar = "";
      let afterThink = false;
      let startedWithThink = false;
      let firstNonWhitespaceSeen = false;
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
                  // Track if the very first non-whitespace is <think>
                  if (!firstNonWhitespaceSeen && /\S/.test(c)) {
                    firstNonWhitespaceSeen = true;
                    if (c === '<' && chars.slice(i, i+6) === '<think>') {
                      startedWithThink = true;
                    }
                  }
                  thinkBuffer += c;
                  // Enter <think>
                  if (!inThink && thinkBuffer.endsWith('<think>')) {
                    inThink = true;
                    thinkBuffer = "";
                    thinkParagraph = "";
                    afterThink = false;
                  } else if (inThink && thinkBuffer.endsWith('</think>')) {
                    // End of <think>
                    if (thinkParagraph.trim()) {
                      replaceThinkBubble(thinkParagraph);
                    }
                    inThink = false;
                    thinkBuffer = "";
                    thinkParagraph = "";
                    afterThink = true;
                  } else if (inThink) {
                    // Inside <think> ... </think>
                    // Check for paragraph break (\n\n)
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
                    // Outside <think> ... </think>
                    if (afterThink) {
                      // Ignore all newlines after </think> until first non-newline
                      if (c === '\n') {
                        // skip
                      } else {
                        afterThink = false;
                        // Prevent <think at the very start from being added to summary
                        if (!(startedWithThink && !summaryBuffer.trim() && c === '<')) {
                          summaryBuffer += c;
                        }
                      }
                    } else {
                      // Prevent <think at the very start from being added to summary
                      if (!(startedWithThink && !summaryBuffer.trim() && c === '<')) {
                        summaryBuffer += c;
                      }
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
      setDone(true);
      // Clean summaryBuffer of any <think>...</think> blocks or stray tags before showing result
      let cleanSummary = summaryBuffer
        .replace(/<think>[\s\S]*?<\/think>/gi, '') // Remove all <think>...</think> blocks
        .replace(/<\/?think>/gi, '') // Remove any stray <think> or </think>
        .replace(/^[-\s]+|[-\s]+$/g, '') // Remove leading/trailing dashes and whitespace
        .trim();
      setSummary(cleanSummary);
      // Fade out the last think bubble at the end, then show result
      if (thinking && thinking.visible) {
        setThinking(prev => prev ? { ...prev, visible: false } : null);
        fadeTimeout.current = setTimeout(() => {
          setThinking(null);
          setShowResult(true);
        }, 400);
      } else {
        setShowResult(true);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="summarizer-vertical-root">
      <Box className="summarizer-vertical-card">
        <Typography variant="h3" className="summarizer-title" sx={{ mb: 2, fontWeight: 800, letterSpacing: -1, textAlign: 'center' }}>
          AI Text Summarizer
        </Typography>
        <textarea
          className="summarizer-textarea"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={8}
          disabled={loading}
          style={{ width: '90%', minHeight: 120, fontSize: '1.1rem', padding: 16, borderRadius: 8, border: '1.5px solid #cbd5e1', background: '#f8fafc', marginBottom: 16, resize: 'vertical', boxSizing: 'border-box' }}
        />
        <Button
          className="summarizer-btn"
          onClick={handleSummarize}
          disabled={loading || !text.trim()}
          variant="contained"
          size="large"
          sx={{ width: '90%', py: 1.5, fontWeight: 700, fontSize: '1.1rem', borderRadius: 2, boxShadow: 2, mt: 1 }}
        >
          {loading ? <><CircularProgress size={22} sx={{ color: 'white', mr: 1 }} /> Summarizing...</> : "Summarize"}
        </Button>
        {error && <Paper elevation={2} className="summarizer-error" sx={{ mt: 2, p: 1.5, width: '90%' }}>{error}</Paper>}
        <Box className="summarizer-vertical-main">
          {/* THINKING BUBBLE (centered) */}
          {!showResult && (
            <Box className="summarizer-think-vertical" sx={{ width: '100%', minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {thinking && (
                <Paper
                  key={thinking.id}
                  className={`think-bubble-large${thinking.visible ? ' animate-in' : ' fade-out-fast'}`}
                  elevation={4}
                  sx={{ width: '90%', p: 4, borderRadius: 3, bgcolor: '#f5f3ff', color: '#6d28d9', fontSize: '1.18rem', minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ReactMarkdown>{thinking.text}</ReactMarkdown>
                </Paper>
              )}
              {loading && showPlaceholder && !thinking && (
                <Paper elevation={1} className="think-bubble think-placeholder" sx={{ width: '90%', p: 3, borderRadius: 2, fontStyle: 'italic', color: '#a1a1aa', bgcolor: '#f3f4f6', minHeight: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  Waiting for thoughts...
                </Paper>
              )}
            </Box>
          )}
          {/* RESULT (Word doc style) */}
          {showResult && (
            <Paper elevation={6} className="summarizer-result-doc animate-in" sx={{ width: '98%', p: { xs: 2, sm: 5 }, borderRadius: 4, bgcolor: 'white', color: '#1e293b', fontSize: { xs: '1.05rem', sm: '1.22rem' }, lineHeight: 1.8, letterSpacing: '0.01em', minHeight: 220, mt: 2, boxShadow: 8 }}>
              <ReactMarkdown>{summary || (loading ? "..." : "No summary yet.")}</ReactMarkdown>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}  