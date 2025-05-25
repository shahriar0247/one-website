import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

export default function Paraphrase() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState('');
  const [style, setStyle] = useState('standard');

  const handleParaphrase = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/paraphrase/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          style,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.paraphrased_text);
      } else {
        throw new Error(data.error || 'Paraphrasing failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPage
      title="AI Paraphraser"
      description="Rewrite text in different styles while maintaining the original meaning using AI."
      icon={<AutoFixHighIcon />}
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
            placeholder="Enter text to paraphrase..."
            disabled={loading}
          />

          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Writing Style</InputLabel>
            <Select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              label="Writing Style"
            >
              <MenuItem value="standard">Standard</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
              <MenuItem value="simple">Simple</MenuItem>
              <MenuItem value="creative">Creative</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
            </Select>
          </FormControl>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              onClick={handleParaphrase}
              disabled={!text.trim() || loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Paraphrasing...' : 'Paraphrase Text'}
            </Button>
          </Box>
        </Paper>

        {result && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Paraphrased Text
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              value={result}
              InputProps={{ readOnly: true }}
            />
          </Paper>
        )}
      </Box>
    </ToolPage>
  );
} 