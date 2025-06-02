import React, { useState } from 'react';
import ToolCard from './ToolCard';
import { Box, Typography } from '@mui/material';

export default function GrammarChecker() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/grammar/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.success) {
        const parsedResult = typeof data.result === 'string' 
          ? JSON.parse(data.result) 
          : data.result;

        setResult(parsedResult);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({
        error: 'Failed to check grammar. Please try again.',
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
      <Box>
        {result.corrections?.length > 0 && (
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>Grammar Corrections:</Typography>
            <ul>
              {result.corrections.map((correction, index) => (
                <li key={index}>{correction}</li>
              ))}
            </ul>
          </Box>
        )}

        {result.suggestions?.length > 0 && (
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>Style Suggestions:</Typography>
            <ul>
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </Box>
        )}

        {result.spelling?.length > 0 && (
          <Box mb={2}>
            <Typography variant="h6" gutterBottom>Spelling Errors:</Typography>
            <ul>
              {result.spelling.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Box>
        )}

        {result.improved_text && (
          <Box>
            <Typography variant="h6" gutterBottom>Improved Text:</Typography>
            <Typography
              variant="body1"
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {result.improved_text}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <ToolCard
      title="Grammar Checker"
      description="Check your text for grammar, spelling, and style improvements."
      inputPlaceholder="Enter your text here..."
      onSubmit={handleSubmit}
      loading={loading}
      result={renderResult()}
      inputValue={text}
      onInputChange={(e) => setText(e.target.value)}
      actionText="Check Grammar"
    />
  );
} 