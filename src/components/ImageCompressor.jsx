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
  Paper,
  Alert,
  Divider,
  Tooltip,
  IconButton,
  Snackbar,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState(80);
  const [resizeImage, setResizeImage] = useState(false);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [maxHeight, setMaxHeight] = useState(1080);
  const [imagePreview, setImagePreview] = useState(null);
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

      // Create an image object to get dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width > 1920 || img.height > 1080) {
          setResizeImage(true);
        }
      };
      img.src = URL.createObjectURL(selectedFile);
    } else {
      setImagePreview(null);
      setOriginalSize(null);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setImagePreview(null);
    setOriginalSize(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed_' + file.name;
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

  return (
    <ToolPage
      title="Image Compressor"
      description="Compress your images to reduce file size while maintaining visual quality."
      icon={<CompressIcon />}
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
              {originalSize && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Original size: {formatFileSize(originalSize)}
                </Typography>
              )}
            </Box>
          )}
        </Paper>

        {file && (
          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  Compression Settings
                  <Tooltip title="Lower quality = smaller file size, but may affect image quality">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Typography gutterBottom>Quality</Typography>
                <Stack spacing={2} direction="row" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    High Compression
                  </Typography>
                  <Slider
                    value={quality}
                    onChange={(e, newValue) => setQuality(newValue)}
                    aria-label="Compression quality"
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

              <Divider />

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={resizeImage}
                      onChange={(e) => setResizeImage(e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Resize if larger than
                      <Tooltip title="Automatically resize large images to save more space">
                        <IconButton size="small" sx={{ ml: 1 }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />

                {resizeImage && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography gutterBottom>Maximum Width</Typography>
                      <Slider
                        value={maxWidth}
                        onChange={(e, newValue) => setMaxWidth(newValue)}
                        aria-label="Maximum width"
                        valueLabelDisplay="auto"
                        min={100}
                        max={3840}
                        step={100}
                        marks={[
                          { value: 1280, label: 'HD' },
                          { value: 1920, label: 'FHD' },
                          { value: 3840, label: '4K' },
                        ]}
                      />
                      <Typography variant="body2" color="text.secondary" align="center">
                        {maxWidth}px
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography gutterBottom>Maximum Height</Typography>
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
                        {maxHeight}px
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Box>

              <Box sx={{ mt: 2 }}>
                <FileActions
                  onProcess={handleCompress}
                  onCancel={handleClearFile}
                  loading={loading}
                  disabled={!file}
                  processText="Compress Image"
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
          message="Image compressed successfully! Check your downloads."
        />
      </Stack>
    </ToolPage>
  );
} 