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
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Alert,
  Divider,
} from '@mui/material';

export default function Paraphrase() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [style, setStyle] = useState('all');

  const handleStyleChange = (event, newStyle) => {
    if (newStyle !== null) {
      setStyle(newStyle);
    }
  };

  const handleParaphrase = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/paraphrase/rewrite', {
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
        const parsedResult = typeof data.result === 'string' 
          ? JSON.parse(data.result) 
          : data.result;
        setResult(parsedResult);
      } else {
        throw new Error(data.error || 'Paraphrasing failed');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      );
    }

    return (
      <Stack spacing={3}>
        {style === 'all' ? (
          <>
            {result.casual && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                  Casual Version
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body1">{result.casual}</Typography>
                </Paper>
              </Box>
            )}

            {result.formal && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                  Formal Version
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body1">{result.formal}</Typography>
                </Paper>
              </Box>
            )}

            {result.creative && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
                  Creative Version
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body1">{result.creative}</Typography>
                </Paper>
              </Box>
            )}
          </>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'text.secondary' }}>
              {style.charAt(0).toUpperCase() + style.slice(1)} Version
            </Typography>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body1">{result[style]}</Typography>
            </Paper>
          </Box>
        )}
      </Stack>
    );
  };

  return (
    <ToolPage
      title="AI Paraphraser"
      description="Rewrite text in different styles while maintaining the original meaning using AI."
      icon={<AutoFixHighIcon />}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Box mb={3}>
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

          <Typography variant="subtitle2" gutterBottom sx={{ color: 'text.secondary' }}>
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
            sx={{ mb: 3 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            <Typography variant="h5" gutterBottom>
              Paraphrased Versions
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {renderResult()}
          </Paper>
        )}
      </Box>
    </ToolPage>
  );
} 