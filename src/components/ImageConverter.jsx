import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import FileUpload from './ui/FileUpload';
import FileActions from './ui/FileActions';
import TransformIcon from '@mui/icons-material/Transform';
import { 
  Typography, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Slider,
  Stack,
} from '@mui/material';

const FORMAT_OPTIONS = [
  { value: 'jpeg', label: 'JPEG', quality: true },
  { value: 'png', label: 'PNG', quality: false },
  { value: 'webp', label: 'WebP', quality: true },
  { value: 'gif', label: 'GIF', quality: false },
  { value: 'bmp', label: 'BMP', quality: false },
];

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);

  const handleFileSelect = (selectedFile, error) => {
    setFile(selectedFile);
    setError(error);
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    formData.append('quality', quality);

    try {
      const response = await fetch('http://localhost:5000/api/image-converter/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `converted.${format}`;

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

  const selectedFormat = FORMAT_OPTIONS.find(f => f.value === format);

  return (
    <ToolPage
      title="Image Format Converter"
      description="Convert your images between different formats while maintaining quality."
      icon={<TransformIcon />}
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
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Output Format</InputLabel>
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              label="Output Format"
            >
              {FORMAT_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedFormat?.quality && (
            <Box>
              <Typography gutterBottom>Quality</Typography>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Lower Size
                </Typography>
                <Slider
                  value={quality}
                  onChange={(e, newValue) => setQuality(newValue)}
                  aria-label="Quality"
                  valueLabelDisplay="auto"
                  min={10}
                  max={100}
                  sx={{ mx: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  Better Quality
                </Typography>
              </Stack>
            </Box>
          )}
        </Box>
      )}

      <FileActions
        onProcess={handleConvert}
        onCancel={handleClearFile}
        loading={loading}
        disabled={!file}
        processText="Convert Image"
        showCancel={!!file}
      />
    </ToolPage>
  );
} 