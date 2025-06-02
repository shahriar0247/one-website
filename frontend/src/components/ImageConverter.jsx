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
  Paper,
  Alert,
  Divider,
  Tooltip,
  IconButton,
  Grid,
  Snackbar,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const FORMAT_OPTIONS = [
  { 
    value: 'jpeg', 
    label: 'JPEG', 
    quality: true,
    description: 'Best for photographs and complex images with many colors',
  },
  { 
    value: 'png', 
    label: 'PNG', 
    quality: false,
    description: 'Best for images with transparency and sharp edges',
  },
  { 
    value: 'webp', 
    label: 'WebP', 
    quality: true,
    description: 'Modern format with excellent compression and quality',
  },
  { 
    value: 'gif', 
    label: 'GIF', 
    quality: false,
    description: 'Best for simple animations and images with few colors',
  },
  { 
    value: 'bmp', 
    label: 'BMP', 
    quality: false,
    description: 'Uncompressed format, best for perfect quality',
  },
];

export default function ImageConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalFormat, setOriginalFormat] = useState(null);
  const [originalSize, setOriginalSize] = useState(null);
  const [success, setSuccess] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = (selectedFile, error) => {
    setFile(selectedFile);
    setError(error);

    if (selectedFile) {
      setOriginalSize(selectedFile.size);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);

      // Try to determine original format from file extension
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      setOriginalFormat(extension);
    } else {
      setImagePreview(null);
      setOriginalFormat(null);
      setOriginalSize(null);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setImagePreview(null);
    setOriginalFormat(null);
    setOriginalSize(null);
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = file.name.split('.')[0] + '.' + format;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess(true);

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
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload Image
          </Typography>
          <FileUpload
            file={file}
            onFileSelect={handleFileSelect}
            onClearFile={handleClearFile}
            accept="image/*"
            maxSize={20}
            error={error}
          />

          {imagePreview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Preview
              </Typography>
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: 1,
                }}
              />
              <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                {originalFormat && (
                  <Typography variant="body2" color="text.secondary">
                    Current format: {originalFormat.toUpperCase()}
                  </Typography>
                )}
                {originalSize && (
                  <Typography variant="body2" color="text.secondary">
                    Size: {formatFileSize(originalSize)}
                  </Typography>
                )}
              </Stack>
            </Box>
          )}
        </Paper>

        {file && (
          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  Conversion Settings
                  <Tooltip title="Choose the best format based on your needs">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>Output Format</InputLabel>
                  <Select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    label="Output Format"
                  >
                    {FORMAT_OPTIONS.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box>
                          <Typography>{option.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {selectedFormat?.quality && (
                <>
                  <Divider />
                  <Box>
                    <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      Quality
                      <Tooltip title="Higher quality means larger file size">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Typography>
                    <Stack spacing={2} direction="row" alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Smaller Size
                      </Typography>
                      <Slider
                        value={quality}
                        onChange={(e, newValue) => setQuality(newValue)}
                        aria-label="Quality"
                        valueLabelDisplay="auto"
                        min={10}
                        max={100}
                        marks={[
                          { value: 10, label: '10%' },
                          { value: 50, label: '50%' },
                          { value: 100, label: '100%' },
                        ]}
                        sx={{ mx: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Best Quality
                      </Typography>
                    </Stack>
                  </Box>
                </>
              )}

              <Box sx={{ mt: 2 }}>
                <FileActions
                  onProcess={handleConvert}
                  onCancel={handleClearFile}
                  loading={loading}
                  disabled={!file || format === originalFormat}
                  processText="Convert Image"
                  showCancel={!!file}
                />
              </Box>
            </Stack>
          </Paper>
        )}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          message="Image converted successfully! Check your downloads."
        />
      </Stack>
    </ToolPage>
  );
} 