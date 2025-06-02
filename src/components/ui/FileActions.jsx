import React from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Button, 
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';

const FileActions = ({ 
  onProcess,
  onCancel,
  loading = false,
  disabled = false,
  processText = 'Process',
  showCancel = true,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={onProcess}
        disabled={disabled || loading}
        startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
      >
        {loading ? 'Processing...' : processText}
      </Button>
      
      {showCancel && (
        <Button
          variant="outlined"
          color="inherit"
          onClick={onCancel}
          disabled={loading}
          startIcon={<ClearIcon />}
        >
          Cancel
        </Button>
      )}
    </Box>
  );
};

FileActions.propTypes = {
  onProcess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  processText: PropTypes.string,
  showCancel: PropTypes.bool,
};

export default FileActions; 