import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Stack,
} from '@mui/material';

export default function LineBreaks() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('remove');
  const [result, setResult] = useState('');

  const handleProcess = () => {
    if (!text.trim()) return;

    let processed = text;
    switch (mode) {
      case 'remove':
        // Remove all line breaks
        processed = text.replace(/[\r\n]+/g, ' ').trim();
        break;
      case 'single':
        // Convert multiple line breaks to single
        processed = text.replace(/[\r\n]+/g, '\n').trim();
        break;
      case 'double':
        // Convert multiple line breaks to double
        processed = text.replace(/[\r\n]+/g, '\n\n').trim();
        break;
      case 'paragraph':
        // Add extra line break between paragraphs
        processed = text
          .replace(/[\r\n]+/g, '\n')
          .split('\n')
          .filter(line => line.trim())
          .join('\n\n')
          .trim();
        break;
      default:
        processed = text;
    }
    setResult(processed);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <ToolPage
      title="Line Breaks Remover"
      description="Remove or modify line breaks in your text to match your desired format."
      icon={<FormatClearIcon />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Original Text
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
          />

          <FormControl component="fieldset" sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Processing Mode
            </Typography>
            <RadioGroup
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <FormControlLabel
                value="remove"
                control={<Radio />}
                label="Remove all line breaks"
              />
              <FormControlLabel
                value="single"
                control={<Radio />}
                label="Convert to single line breaks"
              />
              <FormControlLabel
                value="double"
                control={<Radio />}
                label="Convert to double line breaks"
              />
              <FormControlLabel
                value="paragraph"
                control={<Radio />}
                label="Format as paragraphs"
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleProcess}
              disabled={!text.trim()}
            >
              Process Text
            </Button>
          </Box>
        </Paper>

        {result && (
          <Paper sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="subtitle2">
                Processed Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={6}
                value={result}
                InputProps={{ readOnly: true }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleCopy}>
                  Copy to Clipboard
                </Button>
              </Box>
            </Stack>
          </Paper>
        )}
      </Box>
    </ToolPage>
  );
} 