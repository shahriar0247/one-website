import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import FileUpload from './ui/FileUpload';
import FileActions from './ui/FileActions';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { 
  Box, 
  Paper, 
  Typography,
  CircularProgress,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import InfoIcon from '@mui/icons-material/Info';

export default function ImageToText() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = (selectedFile, error) => {
    setFile(selectedFile);
    setError(error);
    setExtractedText('');
    setCopySuccess(false);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setImagePreview(null);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setExtractedText('');
    setCopySuccess(false);
    setImagePreview(null);
  };

  const handleExtractText = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(false);
    setCopySuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/image-to-text/extract', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Text extraction failed');
      }

      const data = await response.json();
      setExtractedText(data.text);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(extractedText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy text to clipboard');
    }
  };

  const handleDownload = () => {
    if (!extractedText) return;

    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'extracted_text.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <ToolPage
      title="Image to Text (OCR)"
      description="Extract text from images using advanced Optical Character Recognition (OCR) technology."
      icon={<TextSnippetIcon />}
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
            maxSize={10}
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
            </Box>
          )}

          {file && (
            <Box sx={{ mt: 2 }}>
              <FileActions
                onProcess={handleExtractText}
                onCancel={handleClearFile}
                loading={loading}
                disabled={!file}
                processText="Extract Text"
                showCancel={!!file}
              />
            </Box>
          )}
        </Paper>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}

        {extractedText && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Extracted Text
                <Tooltip title="The extracted text might contain some inaccuracies. Please review and edit as needed.">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyText}
                  size="small"
                >
                  Copy
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  size="small"
                >
                  Download
                </Button>
              </Stack>
            </Box>
            <Paper
              sx={{
                p: 2,
                bgcolor: 'background.default',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '400px',
                overflow: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.5,
              }}
            >
              {extractedText}
            </Paper>
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
          message="Text extracted successfully!"
        />

        <Snackbar
          open={copySuccess}
          autoHideDuration={2000}
          onClose={() => setCopySuccess(false)}
          message="Text copied to clipboard!"
        />
      </Stack>
    </ToolPage>
  );
} 