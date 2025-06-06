import React from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getFileIcon = (type) => {
  if (type.startsWith('image/')) return PhotoIcon;
  if (type.includes('pdf') || type.includes('text')) return DocumentTextIcon;
  return DocumentIcon;
};

const FileInfo = ({ file, preview, className = '' }) => {
  if (!file) return null;

  const Icon = getFileIcon(file.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {file.name}
          </p>
          <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>{file.type || 'Unknown type'}</span>
          </div>
        </div>
      </div>

      {preview && file.type.startsWith('image/') && (
        <div className="mt-4">
          <img
            src={preview}
            alt={file.name}
            className="w-full h-auto rounded-lg object-cover"
          />
        </div>
      )}
    </motion.div>
  );
};

export default FileInfo; 