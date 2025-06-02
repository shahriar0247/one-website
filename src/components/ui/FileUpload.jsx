import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import { 
  Box, 
  Typography, 
  Paper,
  IconButton,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const FileUpload = ({ 
  file, 
  onFileSelect, 
  onClearFile, 
  accept, 
  maxSize = 10, // in MB
  error 
}) => {
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length > 0) {
      const rejection = rejectedFiles[0];
      let errorMessage = 'File upload failed';
      
      if (rejection.errors[0].code === 'file-too-large') {
        errorMessage = `File is too large. Max size is ${maxSize}MB`;
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        errorMessage = 'Invalid file type';
      }
      
      onFileSelect(null, errorMessage);
      return;
    }

    if (acceptedFiles?.length > 0) {
      onFileSelect(acceptedFiles[0], null);
    }
  }, [onFileSelect, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSize * 1024 * 1024, // Convert MB to bytes
    multiple: false
  });

  return (
    <Box>
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          border: theme => `2px dashed ${error ? theme.palette.error.main : isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
          borderRadius: 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            borderColor: theme => error ? theme.palette.error.main : theme.palette.primary.main,
            bgcolor: 'action.hover',
          },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon color={error ? "error" : "primary"} sx={{ fontSize: 40 }} />
        
        {file ? (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle2" color="primary" noWrap>
              {file.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {(file.size / (1024 * 1024)).toFixed(2)}MB
            </Typography>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onClearFile();
              }}
              sx={{ ml: 1 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" color={error ? "error" : "textPrimary"}>
              {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maximum file size: {maxSize}MB
            </Typography>
          </>
        )}
      </Paper>
      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

FileUpload.propTypes = {
  file: PropTypes.object,
  onFileSelect: PropTypes.func.isRequired,
  onClearFile: PropTypes.func.isRequired,
  accept: PropTypes.string,
  maxSize: PropTypes.number,
  error: PropTypes.string,
};

export default FileUpload; 