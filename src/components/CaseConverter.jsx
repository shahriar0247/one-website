import React, { useState } from 'react';
import ToolCard from './ToolCard';
import { Box, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [caseType, setCaseType] = useState('upper');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCaseTypeChange = (event, newType) => {
    if (newType !== null) {
      setCaseType(newType);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/case-converter/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, case_type: caseType }),
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
        error: 'Failed to convert text. Please try again.',
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
        <Typography variant="h6" gutterBottom>Converted Text:</Typography>
        <Typography
          variant="body1"
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider',
            fontFamily: 'monospace',
          }}
        >
          {result.converted_text}
        </Typography>
      </Box>
    );
  };

  return (
    <Box>
      <Box mb={2}>
        <ToggleButtonGroup
          value={caseType}
          exclusive
          onChange={handleCaseTypeChange}
          aria-label="text case"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="upper" aria-label="uppercase">
            UPPERCASE
          </ToggleButton>
          <ToggleButton value="lower" aria-label="lowercase">
            lowercase
          </ToggleButton>
          <ToggleButton value="title" aria-label="title case">
            Title Case
          </ToggleButton>
          <ToggleButton value="camel" aria-label="camel case">
            camelCase
          </ToggleButton>
          <ToggleButton value="snake" aria-label="snake case">
            snake_case
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ToolCard
        title="Case Converter"
        description="Convert text between different case styles: UPPERCASE, lowercase, Title Case, camelCase, and snake_case."
        inputPlaceholder="Enter your text here..."
        onSubmit={handleSubmit}
        loading={loading}
        result={renderResult()}
        inputValue={text}
        onInputChange={(e) => setText(e.target.value)}
        actionText="Convert"
      />
    </Box>
  );
} 