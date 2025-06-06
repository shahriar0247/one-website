import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import { 
  DocumentIcon,
  ArrowPathIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  AdjustmentsHorizontalIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

const SUPPORTED_FORMATS = {
  'to-pdf': [
    { value: 'docx', label: 'Word Document (DOCX)', accept: '.docx', icon: '📝' },
    { value: 'pptx', label: 'PowerPoint (PPTX)', accept: '.pptx', icon: '📊' },
    { value: 'xlsx', label: 'Excel Spreadsheet (XLSX)', accept: '.xlsx', icon: '📈' },
    { value: 'jpg', label: 'JPEG Image', accept: '.jpg,.jpeg', icon: '🖼️' },
    { value: 'png', label: 'PNG Image', accept: '.png', icon: '🎨' },
    { value: 'txt', label: 'Text File', accept: '.txt', icon: '📄' },
    { value: 'md', label: 'Markdown', accept: '.md', icon: '📋' },
  ],
  'from-pdf': [
    { value: 'docx', label: 'Word Document (DOCX)', icon: '📝' },
    { value: 'txt', label: 'Text File (TXT)', icon: '📄' },
    { value: 'jpg', label: 'JPEG Image', icon: '🖼️' },
    { value: 'png', label: 'PNG Image', icon: '🎨' },
    { value: 'html', label: 'HTML Document', icon: '🌐' },
    { value: 'md', label: 'Markdown', icon: '📋' },
  ],
};

const QUALITY_PRESETS = [
  { name: 'Maximum', value: 100 },
  { name: 'High', value: 85 },
  { name: 'Medium', value: 70 },
  { name: 'Low', value: 50 },
];

export default function PdfConverter() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('to-pdf');
  const [format, setFormat] = useState('');
  const [quality, setQuality] = useState(85);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [optimizeOutput, setOptimizeOutput] = useState(true);
  const [previews, setPreviews] = useState([]);
  const [password, setPassword] = useState('');
  const [isProtected, setIsProtected] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles);
    
    if (newFiles.length === 0) {
      setError('Please select valid files');
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    setError(null);

    // Generate previews for images
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, {
            file: file.name,
            preview: reader.result,
            size: file.size
          }]);
        };
        reader.readAsDataURL(file);
      } else {
        setPreviews(prev => [...prev, {
          file: file.name,
          size: file.size
        }]);
      }
    });
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentFormats = () => {
    return SUPPORTED_FORMATS[mode] || [];
  };

  const getAcceptedFiles = () => {
    if (mode === 'to-pdf') {
      return getCurrentFormats().map(f => f.accept).join(',');
    }
    return '.pdf';
  };

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    try {
      // Implement actual conversion logic here
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPage
      title="PDF Converter"
      description="Convert files to and from PDF format. Supports various document and image formats."
    >
      <div className="space-y-8">
        {/* Mode Selection */}
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setMode('to-pdf');
              setFormat('');
              setFiles([]);
              setPreviews([]);
            }}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 transition-all duration-200",
              mode === 'to-pdf'
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <div className="flex items-center justify-center space-x-3">
              <DocumentArrowUpIcon className="w-6 h-6" />
              <span className="font-medium">Convert to PDF</span>
            </div>
          </button>

          <button
            onClick={() => {
              setMode('from-pdf');
              setFormat('');
              setFiles([]);
              setPreviews([]);
            }}
            className={cn(
              "flex-1 p-4 rounded-xl border-2 transition-all duration-200",
              mode === 'from-pdf'
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            )}
          >
            <div className="flex items-center justify-center space-x-3">
              <DocumentArrowDownIcon className="w-6 h-6" />
              <span className="font-medium">Convert from PDF</span>
            </div>
          </button>
        </div>

        {/* Format Selection */}
        <div className="grid md:grid-cols-3 gap-4">
          {getCurrentFormats().map((format) => (
            <button
              key={format.value}
              onClick={() => setFormat(format.value)}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                format.value === format
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{format.icon}</span>
                <span className="font-medium">{format.label}</span>
              </div>
              {format.value === format && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <CheckIcon className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </button>
          ))}
        </div>

        {/* File Upload Area */}
        <div
          className={cn(
            "relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
            files.length === 0 && "hover:bg-gray-50 dark:hover:bg-gray-800/50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileSelect(e.target.files)}
          accept={getAcceptedFiles()}
            multiple
            className="hidden"
          />
          
          <div className="max-w-xl mx-auto">
            <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Upload files
              </button>
              <p className="mt-1 text-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {mode === 'to-pdf'
                ? 'Supported formats: DOCX, PPTX, XLSX, JPG, PNG, TXT'
                : 'PDF files only'} • Max 50MB per file
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Files to Convert ({files.length})
              </h3>
              <button
                onClick={() => {
                  setFiles([]);
                  setPreviews([]);
                }}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Remove all
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 p-4"
                >
                  {preview.preview ? (
                    <img
                      src={preview.preview}
                      alt={preview.file}
                      className="w-full aspect-video object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-lg mb-3">
                      <DocumentIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium truncate">{preview.file}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(preview.size / 1024)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Settings */}
        <div className="space-y-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
            <span>Advanced Settings</span>
          </button>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 overflow-hidden"
              >
                {mode === 'to-pdf' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quality
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {QUALITY_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            onClick={() => setQuality(preset.value)}
                            className={cn(
                              "px-3 py-1 text-sm font-medium rounded-lg transition-colors",
                              quality === preset.value
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="metadata"
                          checked={preserveMetadata}
                          onChange={(e) => setPreserveMetadata(e.target.checked)}
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="metadata"
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          Preserve document metadata
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="optimize"
                          checked={optimizeOutput}
                          onChange={(e) => setOptimizeOutput(e.target.checked)}
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="optimize"
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          Optimize output file size
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="protect"
                          checked={isProtected}
                          onChange={(e) => setIsProtected(e.target.checked)}
                          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <label
                          htmlFor="protect"
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          Password protect PDF
                        </label>
                      </div>

                      {isProtected && (
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConvert}
            disabled={loading || files.length === 0 || !format}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
              loading || files.length === 0 || !format
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white transform hover:-translate-y-0.5"
            )}
          >
            {loading ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                <span>Converting...</span>
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-5 h-5" />
                <span>Convert & Download</span>
              </>
            )}
          </button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center shadow-lg"
            >
              <CheckIcon className="w-5 h-5 mr-2" />
              Conversion successful!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToolPage>
  );
} 