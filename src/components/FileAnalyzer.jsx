import React, { useState } from 'react';
import ToolPage from './ui/ToolPage';
import FileUpload from './ui/FileUpload';
import FileInfo from './ui/FileInfo';
import StorageIcon from '@mui/icons-material/Storage';
import { Typography, Box, Paper, CircularProgress } from '@mui/material';

export default function FileAnalyzer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleFileSelect = async (selectedFile, error) => {
    setFile(selectedFile);
    setError(error);
    setAnalysis(null);

    if (selectedFile && !error) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('http://localhost:5000/api/file-analyzer/analyze', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          setAnalysis(data.analysis);
        } else {
          throw new Error(data.error || 'Analysis failed');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setError(null);
    setAnalysis(null);
  };

  const renderAnalysis = () => {
    if (!analysis) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          File Analysis
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {Object.entries(analysis).map(([key, value]) => (
              <Box key={key}>
                <Typography variant="subtitle2" color="text.secondary">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Typography>
                <Typography variant="body1">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <ToolPage
      title="File Size Analyzer"
      description="Analyze file size, format, and other metadata. Get detailed insights about your files."
      icon={<StorageIcon />}
    >
      <FileUpload
        file={file}
        onFileSelect={handleFileSelect}
        onClearFile={handleClearFile}
        accept="*/*"
        maxSize={100}
        error={error}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {file && !loading && !error && (
        <>
          <FileInfo file={file} showPreview={file.type.startsWith('image/')} />
          {renderAnalysis()}
        </>
      )}
    </ToolPage>
  );
} 