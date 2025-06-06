import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const ActionButton = ({ icon: Icon, label, onClick, variant = 'primary' }) => {
  const baseClasses = "flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    danger: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </button>
  );
};

const FileActions = ({ 
  onDownload,
  onCopy,
  onDelete,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-wrap gap-3 ${className}`}
    >
      {onDownload && (
        <ActionButton
          icon={ArrowDownTrayIcon}
          label="Download"
          onClick={onDownload}
          variant="primary"
        />
      )}
      {onCopy && (
        <ActionButton
          icon={DocumentDuplicateIcon}
          label="Copy"
          onClick={onCopy}
          variant="secondary"
        />
      )}
      {onDelete && (
        <ActionButton
          icon={TrashIcon}
          label="Delete"
          onClick={onDelete}
          variant="danger"
        />
      )}
    </motion.div>
  );
};

export default FileActions; 