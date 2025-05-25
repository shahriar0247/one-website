import React from 'react';
import PropTypes from 'prop-types';

const FileActions = ({ onDownload, onClear, downloadDisabled = false }) => {
  return (
    <div className="flex gap-4 mt-4">
      <button
        onClick={onDownload}
        disabled={downloadDisabled}
        className={`px-4 py-2 rounded-lg font-medium
          ${downloadDisabled 
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
          }`}
      >
        Download
      </button>
      <button
        onClick={onClear}
        className="px-4 py-2 rounded-lg font-medium border border-gray-300
          hover:bg-gray-50 active:bg-gray-100"
      >
        Clear
      </button>
    </div>
  );
};

FileActions.propTypes = {
  onDownload: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  downloadDisabled: PropTypes.bool
};

export default FileActions; 