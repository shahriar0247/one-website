import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField,
  Button,
  CircularProgress,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';

export default function ToneAnalyzer() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/tone-analyzer/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tone Analysis
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* Dominant Tones */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Dominant Tones
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {analysis.dominant_tones.map((tone, index) => (
                  <Chip
                    key={index}
                    label={tone}
                    color="primary"
                    variant={index === 0 ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
            </Box>

            {/* Tone Scores */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Tone Distribution
              </Typography>
              {analysis.tone_scores.map(({ tone, score }) => (
                <Box key={tone} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{tone}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round(score * 100)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={score * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* Overall Sentiment */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Overall Sentiment
              </Typography>
              <Typography variant="body1">
                {analysis.overall_sentiment}
              </Typography>
            </Box>

            {/* Suggestions */}
            {analysis.suggestions && analysis.suggestions.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Suggestions
                </Typography>
                <Stack spacing={1}>
                  {analysis.suggestions.map((suggestion, index) => (
                    <Typography key={index} variant="body2">
                      • {suggestion}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Paper>
      </Box>
    );
  };

  return (
    <ToolPage
      title="Tone Analyzer"
      description="Analyze the tone and emotional content of your text. Get insights about the sentiment, dominant tones, and suggestions for improvement."
      icon={<PsychologyIcon />}
    >
      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here to analyze its tone..."
          disabled={loading}
        />

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={!text.trim() || loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Analyzing...' : 'Analyze Tone'}
          </Button>
        </Box>
      </Paper>

      {renderAnalysis()}
    </ToolPage>
  );
} 