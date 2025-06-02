import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stack,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

export default function FakeNewsDetector() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/fake-news-detector/analyze', {
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

  const renderCredibilityScore = (score) => {
    let color;
    if (score >= 80) color = 'success';
    else if (score >= 60) color = 'warning';
    else color = 'error';

    return (
      <Box sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Credibility Score</Typography>
          <Typography variant="body2" color={`${color}.main`}>
            {score}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={score}
          color={color}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
    );
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    const { 
      credibility_score,
      classification,
      confidence_level,
      red_flags,
      verified_facts,
      sources,
      suggestions,
    } = analysis;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Analysis Results
        </Typography>

        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            {renderCredibilityScore(credibility_score)}

            <Alert 
              severity={classification === 'reliable' ? 'success' : 'warning'}
              sx={{ mb: 3 }}
            >
              <Typography variant="subtitle2">
                Classification: {classification.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confidence Level: {confidence_level}%
              </Typography>
            </Alert>

            {red_flags.length > 0 && (
              <Box>
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Potential Red Flags
                </Typography>
                <List dense>
                  {red_flags.map((flag, index) => (
                    <ListItem key={index}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ErrorIcon color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={flag} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Verified Facts
            </Typography>
            <List dense>
              {verified_facts.map((fact, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={fact} />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Verified Sources
            </Typography>
            <List dense>
              {sources.map((source, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LinkIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={source} />
                </ListItem>
              ))}
            </List>
          </Paper>

          {suggestions.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Suggestions for Verification
              </Typography>
              <List dense>
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <InfoIcon color="info" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={suggestion} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <ToolPage
      title="Fake News Detector"
      description="Analyze text for credibility and detect potential misinformation using AI and fact-checking algorithms."
      icon={<FactCheckIcon />}
    >
      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the news article or text you want to analyze..."
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
            {loading ? 'Analyzing...' : 'Analyze Text'}
          </Button>
        </Box>
      </Paper>

      {renderAnalysis()}
    </ToolPage>
  );
} 