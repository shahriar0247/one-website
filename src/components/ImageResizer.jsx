import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import FileUpload from './ui/FileUpload';
import FileActions from './ui/FileActions';
import CropIcon from '@mui/icons-material/Crop';
import { 
  Typography, 
  Box, 
  TextField, 
  FormControl, 
  FormControlLabel, 
  Radio, 
  RadioGroup,
  InputAdornment,
  Grid,
} from '@mui/material';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resizeMode, setResizeMode] = useState('dimensions');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [percentage, setPercentage] = useState('100');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleFileSelect = (selectedFile, error) => {
    setFile(selectedFile);
    setError(error);

    if (selectedFile && !error) {
      // Create an image object to get dimensions
      const img = new Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setWidth('');
    setHeight('');
    setPercentage('100');
  };

  const handleResize = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('resize_mode', resizeMode);
    formData.append('maintain_aspect_ratio', maintainAspectRatio);

    if (resizeMode === 'dimensions') {
      formData.append('width', width);
      formData.append('height', height);
    } else {
      formData.append('percentage', percentage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/image-resizer/resize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Resize failed');
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'resized_image.jpg';

      // Create a blob from the response and download it
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPage
      title="Image Resizer"
      description="Resize your images by dimensions or percentage while maintaining quality."
      icon={<CropIcon />}
    >
      <FileUpload
        file={file}
        onFileSelect={handleFileSelect}
        onClearFile={handleClearFile}
        accept="image/*"
        maxSize={20}
        error={error}
      />

      {file && (
        <Box sx={{ my: 4 }}>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={resizeMode}
              onChange={(e) => setResizeMode(e.target.value)}
            >
              <FormControlLabel
                value="dimensions"
                control={<Radio />}
                label="Custom Dimensions"
              />
              <FormControlLabel
                value="percentage"
                control={<Radio />}
                label="Scale by Percentage"
              />
            </RadioGroup>
          </FormControl>

          {resizeMode === 'dimensions' ? (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">px</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <TextField
              fullWidth
              label="Scale Percentage"
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              sx={{ mt: 2 }}
            />
          )}

          <FormControlLabel
            control={
              <Radio
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
              />
            }
            label="Maintain aspect ratio"
            sx={{ mt: 2, display: 'block' }}
          />
        </Box>
      )}

      <FileActions
        onProcess={handleResize}
        onCancel={handleClearFile}
        loading={loading}
        disabled={!file}
        processText="Resize Image"
        showCancel={!!file}
      />
    </ToolPage>
  );
} 