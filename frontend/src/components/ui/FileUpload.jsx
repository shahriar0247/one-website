import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

const FileUpload = ({ 
  onFileSelect, 
  accept = {}, 
  maxFiles = 1,
  maxSize = 10485760, // 10MB
  className = ''
}) => {
  const onDrop = useCallback((acceptedFiles) => {
    onFileSelect(acceptedFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full ${className}`}
    >
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-colors duration-200 ease-in-out cursor-pointer
          flex flex-col items-center justify-center text-center
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
        `}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon 
          className={`w-12 h-12 mb-4 ${
            isDragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'
          }`} 
        />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          {isDragActive ? (
            "Drop the files here..."
          ) : (
            "Drag & drop files here, or click to select"
          )}
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Maximum file size: {Math.round(maxSize / 1048576)}MB
        </p>
      </div>
    </motion.div>
  );
};

export default FileUpload; 