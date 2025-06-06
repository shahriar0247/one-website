import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import { 
  PhotoIcon,
  ArrowPathIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline';

const FORMAT_OPTIONS = [
  { 
    value: 'jpeg', 
    label: 'JPEG', 
    quality: true,
    description: 'Best for photographs and complex images with many colors',
    icon: '📸'
  },
  { 
    value: 'png', 
    label: 'PNG', 
    quality: false,
    description: 'Best for images with transparency and sharp edges',
    icon: '🎨'
  },
  { 
    value: 'webp', 
    label: 'WebP', 
    quality: true,
    description: 'Modern format with excellent compression and quality',
    icon: '🚀'
  },
  { 
    value: 'gif', 
    label: 'GIF', 
    quality: false,
    description: 'Best for simple animations and images with few colors',
    icon: '🎬'
  },
  { 
    value: 'bmp', 
    label: 'BMP', 
    quality: false,
    description: 'Uncompressed format, best for perfect quality',
    icon: '💎'
  },
];

const QUALITY_PRESETS = [
  { name: 'Maximum', value: 100 },
  { name: 'High', value: 85 },
  { name: 'Medium', value: 70 },
  { name: 'Low', value: 50 },
];

export default function ImageConverter() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('webp');
  const [quality, setQuality] = useState(85);
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [optimizeOutput, setOptimizeOutput] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previews, setPreviews] = useState([]);

  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFiles) => {
    const newFiles = Array.from(selectedFiles).filter(file => 
      file.type.startsWith('image/')
    );

    if (newFiles.length === 0) {
      setError('Please select valid image files');
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    setError(null);

    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, {
          file: file.name,
          preview: reader.result,
          size: file.size
        }]);
      };
      reader.readAsDataURL(file);
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
      title="Image Converter"
      description="Convert images between different formats with advanced optimization options."
    >
      <div className="space-y-8">
        {/* Format Selection */}
        <div className="grid md:grid-cols-3 gap-4">
          {FORMAT_OPTIONS.map((format) => (
            <button
              key={format.value}
              onClick={() => setSelectedFormat(format.value)}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                selectedFormat === format.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
    >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{format.icon}</span>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {format.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {format.description}
                  </p>
                </div>
              </div>
              {selectedFormat === format.value && (
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
            accept="image/*"
            multiple
            className="hidden"
          />
          
          <div className="max-w-xl mx-auto">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                Upload images
              </button>
              <p className="mt-1 text-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Support for multiple files • Max 10MB per file
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
                  className="relative group rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800"
                >
                  <img
                    src={preview.preview}
                    alt={preview.file}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm p-2">
                    <p className="truncate">{preview.file}</p>
                    <p className="text-xs text-gray-300">
                      {Math.round(preview.size / 1024)} KB
                    </p>
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
                {FORMAT_OPTIONS.find(f => f.value === selectedFormat)?.quality && (
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
                )}

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
                      Preserve image metadata (EXIF, XMP)
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConvert}
            disabled={loading || files.length === 0}
            className={cn(
              "flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200",
              loading || files.length === 0
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