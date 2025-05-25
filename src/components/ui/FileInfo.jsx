import React from 'react';
import PropTypes from 'prop-types';

const FileInfo = ({ file }) => {
  if (!file) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium mb-2">File Information</h3>
      <div className="space-y-2 text-sm">
        <p><span className="font-medium">Name:</span> {file.name}</p>
        <p><span className="font-medium">Type:</span> {file.type || 'Unknown'}</p>
        <p><span className="font-medium">Size:</span> {formatFileSize(file.size)}</p>
        <p><span className="font-medium">Last Modified:</span> {new Date(file.lastModified).toLocaleString()}</p>
      </div>
    </div>
  );
};

FileInfo.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    size: PropTypes.number.isRequired,
    lastModified: PropTypes.number.isRequired
  })
};

export default FileInfo; 