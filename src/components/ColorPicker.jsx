import React, { useState, useCallback } from 'react';
import ToolPage from './ui/ToolPage';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Grid,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { HexColorPicker, HexColorInput } from 'react-colorful';

export default function ColorPicker() {
  const [color, setColor] = useState('#1976d2');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleCopy = useCallback((text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSnackbar({
        open: true,
        message: 'Copied to clipboard!',
        severity: 'success',
      });
    }).catch(() => {
      setSnackbar({
        open: true,
        message: 'Failed to copy to clipboard',
        severity: 'error',
      });
    });
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const rgbColor = {
    r: parseInt(color.slice(1, 3), 16),
    g: parseInt(color.slice(3, 5), 16),
    b: parseInt(color.slice(5, 7), 16),
  };

  const hslColor = (() => {
    const r = rgbColor.r / 255;
    const g = rgbColor.g / 255;
    const b = rgbColor.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  })();

  const colorFormats = [
    {
      label: 'HEX',
      value: color.toUpperCase(),
      format: (value) => value,
    },
    {
      label: 'RGB',
      value: `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`,
      format: (value) => value,
    },
    {
      label: 'HSL',
      value: `hsl(${hslColor.h}, ${hslColor.s}%, ${hslColor.l}%)`,
      format: (value) => value,
    },
  ];

  return (
    <ToolPage
      title="Color Picker"
      description="Pick colors and get their values in different formats (HEX, RGB, HSL)."
      icon={<ColorLensIcon />}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Color Picker
            </Typography>
            <Box sx={{ mb: 3 }}>
              <HexColorPicker color={color} onChange={setColor} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>HEX:</Typography>
              <HexColorInput
                color={color}
                onChange={setColor}
                prefixed
                style={{
                  width: 120,
                  padding: '8px 12px',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 4,
                  fontSize: '1rem',
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Color Values
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {colorFormats.map(({ label, value, format }) => (
                <Box key={label}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {label}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      value={format(value)}
                      InputProps={{ readOnly: true }}
                      size="small"
                    />
                    <IconButton
                      onClick={() => handleCopy(format(value))}
                      size="small"
                      sx={{ alignSelf: 'center' }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Color Preview
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 100,
                borderRadius: 1,
                bgcolor: color,
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ToolPage>
  );
} 