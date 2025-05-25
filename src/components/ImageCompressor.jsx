import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import FileUpload from './ui/FileUpload';
import FileActions from './ui/FileActions';
import CompressIcon from '@mui/icons-material/Compress';
import { 
  Typography, 
  Box, 
  Slider, 
  Stack,
  FormControlLabel,
  Checkbox,
  Grid,
} from '@mui/material';

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState(80);
  const [resizeImage, setResizeImage] = useState(false);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);

  const handleFileSelect = (selectedFile, error) => {
    setFile(selectedFile);
    setError(error);
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);
    formData.append('resize_image', resizeImage);
    if (resizeImage) {
      formData.append('max_width', maxWidth);
      formData.append('max_height', maxHeight);
    }

    try {
      const response = await fetch('http://localhost:5000/api/image-compressor/compress', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Compression failed');
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'compressed_image.jpg';

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
      title="Image Compressor"
      description="Compress your images to reduce file size while maintaining visual quality."
      icon={<CompressIcon />}
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
          <Typography gutterBottom>Compression Quality</Typography>
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Smaller Size
            </Typography>
            <Slider
              value={quality}
              onChange={(e, newValue) => setQuality(newValue)}
              aria-label="Compression quality"
              valueLabelDisplay="auto"
              min={10}
              max={100}
              sx={{ mx: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Better Quality
            </Typography>
          </Stack>

          <FormControlLabel
            control={
              <Checkbox
                checked={resizeImage}
                onChange={(e) => setResizeImage(e.target.checked)}
              />
            }
            label="Resize image if larger than:"
            sx={{ mt: 3, display: 'block' }}
          />

          {resizeImage && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Slider
                  value={maxWidth}
                  onChange={(e, newValue) => setMaxWidth(newValue)}
                  aria-label="Maximum width"
                  valueLabelDisplay="auto"
                  min={100}
                  max={3840}
                  step={100}
                  marks={[
                    { value: 1280, label: '1280px' },
                    { value: 1920, label: '1920px' },
                    { value: 3840, label: '4K' },
                  ]}
                />
                <Typography variant="body2" color="text.secondary" align="center">
                  Max Width: {maxWidth}px
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Slider
                  value={maxHeight}
                  onChange={(e, newValue) => setMaxHeight(newValue)}
                  aria-label="Maximum height"
                  valueLabelDisplay="auto"
                  min={100}
                  max={2160}
                  step={100}
                  marks={[
                    { value: 720, label: '720p' },
                    { value: 1080, label: '1080p' },
                    { value: 2160, label: '4K' },
                  ]}
                />
                <Typography variant="body2" color="text.secondary" align="center">
                  Max Height: {maxHeight}px
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
      )}

      <FileActions
        onProcess={handleCompress}
        onCancel={handleClearFile}
        loading={loading}
        disabled={!file}
        processText="Compress Image"
        showCancel={!!file}
      />
    </ToolPage>
  );
} 