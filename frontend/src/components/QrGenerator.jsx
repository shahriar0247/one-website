import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField,
  Button,
  CircularProgress,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  IconButton,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { HexColorPicker } from 'react-colorful';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [format, setFormat] = useState('png');
  const [size, setSize] = useState(300);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [includeMargin, setIncludeMargin] = useState(true);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/qr-generator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          format,
          size,
          foreground_color: foregroundColor.replace('#', ''),
          background_color: backgroundColor.replace('#', ''),
          include_margin: includeMargin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'QR code generation failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setQrCode(url);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;

    const a = document.createElement('a');
    a.href = qrCode;
    a.download = `qr-code.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolPage
      title="QR Code Generator"
      description="Generate customizable QR codes for text, URLs, or any other data."
      icon={<QrCodeIcon />}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text or URL to generate QR code..."
                disabled={loading}
              />

              <Box>
                <Typography gutterBottom>Size (pixels)</Typography>
                <Slider
                  value={size}
                  onChange={(e, newValue) => setSize(newValue)}
                  min={100}
                  max={1000}
                  step={50}
                  marks={[
                    { value: 100, label: '100px' },
                    { value: 300, label: '300px' },
                    { value: 500, label: '500px' },
                    { value: 1000, label: '1000px' },
                  ]}
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Format</InputLabel>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  label="Format"
                >
                  <MenuItem value="png">PNG</MenuItem>
                  <MenuItem value="svg">SVG</MenuItem>
                  <MenuItem value="jpeg">JPEG</MenuItem>
                </Select>
              </FormControl>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography>Foreground Color</Typography>
                  <IconButton
                    onClick={() => setShowColorPicker('foreground')}
                    sx={{ bgcolor: foregroundColor }}
                  >
                    <ColorLensIcon sx={{ color: '#fff' }} />
                  </IconButton>
                </Box>
                {showColorPicker === 'foreground' && (
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Paper sx={{ position: 'absolute', p: 1 }}>
                      <HexColorPicker
                        color={foregroundColor}
                        onChange={setForegroundColor}
                      />
                    </Paper>
                  </Box>
                )}
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography>Background Color</Typography>
                  <IconButton
                    onClick={() => setShowColorPicker('background')}
                    sx={{ bgcolor: backgroundColor }}
                  >
                    <ColorLensIcon sx={{ color: '#000' }} />
                  </IconButton>
                </Box>
                {showColorPicker === 'background' && (
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Paper sx={{ position: 'absolute', p: 1 }}>
                      <HexColorPicker
                        color={backgroundColor}
                        onChange={setBackgroundColor}
                      />
                    </Paper>
                  </Box>
                )}
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={includeMargin}
                    onChange={(e) => setIncludeMargin(e.target.checked)}
                  />
                }
                label="Include Margin"
              />

              {error && (
                <Typography color="error">
                  {error}
                </Typography>
              )}

              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={!text.trim() || loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Preview
            </Typography>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 300,
              }}
            >
              {qrCode ? (
                <>
                  <Box
                    component="img"
                    src={qrCode}
                    alt="Generated QR Code"
                    sx={{
                      maxWidth: '100%',
                      height: 'auto',
                      mb: 2,
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                  >
                    Download QR Code
                  </Button>
                </>
              ) : (
                <Typography color="text.secondary">
                  QR code preview will appear here
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </ToolPage>
  );
} 