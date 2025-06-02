import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { 
  Box, 
  Paper, 
  Typography, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import FileUpload from './ui/FileUpload';
import FileActions from './ui/FileActions';

const SUPPORTED_FORMATS = {
  'to-pdf': [
    { value: 'docx', label: 'Word Document (DOCX)', accept: '.docx' },
    { value: 'pptx', label: 'PowerPoint (PPTX)', accept: '.pptx' },
    { value: 'xlsx', label: 'Excel Spreadsheet (XLSX)', accept: '.xlsx' },
    { value: 'jpg', label: 'JPEG Image', accept: '.jpg,.jpeg' },
    { value: 'png', label: 'PNG Image', accept: '.png' },
  ],
  'from-pdf': [
    { value: 'docx', label: 'Word Document (DOCX)' },
    { value: 'txt', label: 'Text File (TXT)' },
    { value: 'jpg', label: 'JPEG Image' },
    { value: 'png', label: 'PNG Image' },
  ],
};

export default function PdfConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('to-pdf');
  const [format, setFormat] = useState('');

  const handleFileSelect = (selectedFile, error) => {
    setFile(selectedFile);
    setError(error);
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
  };

  const handleConvert = async () => {
    if (!file || !format) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    try {
      const response = await fetch(`http://localhost:5000/api/pdf-converter/${mode}`, {
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

  const getCurrentFormats = () => SUPPORTED_FORMATS[mode];
  const getAcceptedFiles = () => {
    if (mode === 'to-pdf') {
      return getCurrentFormats().map(f => f.accept).join(',');
    }
    return '.pdf';
  };

  return (
    <ToolPage
      title="PDF Converter"
      description="Convert files to and from PDF format. Supports various document and image formats."
      icon={<PictureAsPdfIcon />}
    >
      <Paper sx={{ p: 3 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Conversion Mode</InputLabel>
          <Select
            value={mode}
            onChange={(e) => {
              setMode(e.target.value);
              setFormat('');
              setFile(null);
            }}
            label="Conversion Mode"
          >
            <MenuItem value="to-pdf">Convert to PDF</MenuItem>
            <MenuItem value="from-pdf">Convert from PDF</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Output Format</InputLabel>
          <Select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            label="Output Format"
          >
            {getCurrentFormats().map(({ value, label }) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FileUpload
          file={file}
          onFileSelect={handleFileSelect}
          onClearFile={handleClearFile}
          accept={getAcceptedFiles()}
          maxSize={20}
          error={error}
        />

        <FileActions
          onProcess={handleConvert}
          onCancel={handleClearFile}
          loading={loading}
          disabled={!file || !format}
          processText={mode === 'to-pdf' ? 'Convert to PDF' : 'Convert from PDF'}
          showCancel={!!file}
        />

        <Box sx={{ mt: 3 }}>
          <Alert severity="info">
            Maximum file size: 20MB. For larger files, please try compressing them first.
          </Alert>
        </Box>
      </Paper>
    </ToolPage>
  );
} 