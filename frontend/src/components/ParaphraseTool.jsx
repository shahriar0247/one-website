import React, { useState } from 'react';
import ToolCard from './ToolCard';
import { Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';

export default function ParaphraseTool() {
  const [text, setText] = useState('');
  const [style, setStyle] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleStyleChange = (event, newStyle) => {
    if (newStyle !== null) {
      setStyle(newStyle);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/paraphrase/rewrite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, style }),
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
        error: 'Failed to paraphrase text. Please try again.',
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
        {style === 'all' ? (
          <>
            {result.casual && (
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Casual Version:</Typography>
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
                  {result.casual}
                </Typography>
              </Box>
            )}

            {result.formal && (
              <Box mb={3}>
                <Typography variant="h6" gutterBottom>Formal Version:</Typography>
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
                  {result.formal}
                </Typography>
              </Box>
            )}

            {result.creative && (
              <Box>
                <Typography variant="h6" gutterBottom>Creative Version:</Typography>
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
                  {result.creative}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>Paraphrased Text:</Typography>
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
              {result[style]}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box mb={2}>
        <ToggleButtonGroup
          value={style}
          exclusive
          onChange={handleStyleChange}
          aria-label="text style"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="all" aria-label="all styles">
            All Styles
          </ToggleButton>
          <ToggleButton value="casual" aria-label="casual">
            Casual
          </ToggleButton>
          <ToggleButton value="formal" aria-label="formal">
            Formal
          </ToggleButton>
          <ToggleButton value="creative" aria-label="creative">
            Creative
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ToolCard
        title="Paraphrasing Tool"
        description="Rewrite your text in different styles while maintaining the original meaning."
        inputPlaceholder="Enter your text here..."
        onSubmit={handleSubmit}
        loading={loading}
        result={renderResult()}
        inputValue={text}
        onInputChange={(e) => setText(e.target.value)}
        actionText="Paraphrase"
      />
    </Box>
  );
} 