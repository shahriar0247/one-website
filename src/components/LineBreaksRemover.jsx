import React, { useState } from 'react';
import ToolCard from './ToolCard';
import { Box, ToggleButton, ToggleButtonGroup, Typography, Grid } from '@mui/material';

export default function LineBreaksRemover() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/line-breaks/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, mode }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({
        error: 'Failed to process text. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    if (result.error) {
      return <Typography color="error">{result.error}</Typography>;
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Original Text:</Typography>
          <Typography
            variant="body1"
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              minHeight: '100px',
            }}
          >
            {result.original_text}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>Processed Text:</Typography>
          <Typography
            variant="body1"
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              minHeight: '100px',
            }}
          >
            {result.processed_text}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box>
      <Box mb={2}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="text processing mode"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="all" aria-label="remove all">
            Remove All
          </ToggleButton>
          <ToggleButton value="breaks" aria-label="remove line breaks">
            Line Breaks Only
          </ToggleButton>
          <ToggleButton value="tabs" aria-label="remove tabs">
            Tabs Only
          </ToggleButton>
          <ToggleButton value="spaces" aria-label="remove extra spaces">
            Extra Spaces
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ToolCard
        title="Line Breaks Remover"
        description="Clean up text by removing line breaks, tabs, or extra whitespace. Compare the original and processed text side by side."
        inputPlaceholder="Enter your text here..."
        onSubmit={handleSubmit}
        loading={loading}
        result={renderResult()}
        inputValue={text}
        onInputChange={(e) => setText(e.target.value)}
        actionText="Process Text"
      />
    </Box>
  );
} 