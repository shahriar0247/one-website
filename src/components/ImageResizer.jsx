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
  Paper,
  Stack,
  Alert,
  Divider,
  Tooltip,
  IconButton,
  Switch,
  Snackbar,
  Slider,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resizeMode, setResizeMode] = useState('dimensions');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [percentage, setPercentage] = useState('100');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (selectedFile, error) => {
    setFile(selectedFile);
    setError(error);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = URL.createObjectURL(selectedFile);
    } else {
      setImagePreview(null);
      setOriginalSize({ width: 0, height: 0 });
      setWidth('');
      setHeight('');
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setImagePreview(null);
    setOriginalSize({ width: 0, height: 0 });
    setWidth('');
    setHeight('');
    setPercentage('100');
  };

  const handleWidthChange = (newWidth) => {
    setWidth(newWidth);
    if (maintainAspectRatio && originalSize.width && originalSize.height) {
      const ratio = originalSize.height / originalSize.width;
      setHeight(Math.round(newWidth * ratio).toString());
    }
  };

  const handleHeightChange = (newHeight) => {
    setHeight(newHeight);
    if (maintainAspectRatio && originalSize.width && originalSize.height) {
      const ratio = originalSize.width / originalSize.height;
      setWidth(Math.round(newHeight * ratio).toString());
    }
  };

  const handleResize = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

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

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = file.name.split('.')[0] + '_resized.' + file.name.split('.').pop();
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

  const calculateNewDimensions = () => {
    if (!originalSize.width || !originalSize.height) return null;

    if (resizeMode === 'dimensions') {
      const newWidth = parseInt(width) || originalSize.width;
      const newHeight = parseInt(height) || originalSize.height;
      return { width: newWidth, height: newHeight };
    } else {
      const scale = parseInt(percentage) / 100;
      return {
        width: Math.round(originalSize.width * scale),
        height: Math.round(originalSize.height * scale),
      };
    }
  };

  const newDimensions = calculateNewDimensions();

  return (
    <ToolPage
      title="Image Resizer"
      description="Resize your images by dimensions or percentage while maintaining quality."
      icon={<CropIcon />}
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Original dimensions: {originalSize.width} × {originalSize.height} pixels
              </Typography>
            </Box>
          )}
        </Paper>

        {file && (
          <Paper sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  Resize Settings
                  <Tooltip title="Choose between exact dimensions or percentage scaling">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>

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
              </Box>

              <Divider />

              {resizeMode === 'dimensions' ? (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Width"
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
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
                        onChange={(e) => handleHeightChange(e.target.value)}
                        InputProps={{
                          endAdornment: <InputAdornment position="end">px</InputAdornment>,
                        }}
                      />
                    </Grid>
                  </Grid>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={maintainAspectRatio}
                        onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                        icon={<AspectRatioIcon />}
                        checkedIcon={<AspectRatioIcon />}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        Maintain aspect ratio
                        <Tooltip title="Keep the original proportions of the image">
                          <IconButton size="small" sx={{ ml: 1 }}>
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                    sx={{ mt: 2 }}
                  />
                </Box>
              ) : (
                <Box>
                  <Typography gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    Scale Percentage
                    <Tooltip title="Scale the image proportionally by percentage">
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Smaller
                    </Typography>
                    <Slider
                      value={parseInt(percentage)}
                      onChange={(e, newValue) => setPercentage(newValue.toString())}
                      aria-label="Scale percentage"
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${value}%`}
                      min={1}
                      max={200}
                      marks={[
                        { value: 25, label: '25%' },
                        { value: 50, label: '50%' },
                        { value: 100, label: '100%' },
                        { value: 200, label: '200%' },
                      ]}
                      sx={{ mx: 2 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Larger
                    </Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 1, display: 'block' }}>
                    100% = Original size, 200% = Double size, 50% = Half size
                  </Typography>
                </Box>
              )}

              {newDimensions && (
                <Alert severity="info">
                  New dimensions will be: {newDimensions.width} × {newDimensions.height} pixels
                </Alert>
              )}

              <Box sx={{ mt: 2 }}>
                <FileActions
                  onProcess={handleResize}
                  onCancel={handleClearFile}
                  loading={loading}
                  disabled={!file}
                  processText="Resize Image"
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
          message="Image resized successfully! Check your downloads."
        />
      </Stack>
    </ToolPage>
  );
} 