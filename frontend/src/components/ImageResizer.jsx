import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import { 
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowPathIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  LockClosedIcon,
  LockOpenIcon,
  PhotoIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

const ASPECT_RATIOS = [
  { name: 'Original', value: 'original' },
  { name: '16:9', value: '16:9' },
  { name: '4:3', value: '4:3' },
  { name: '1:1', value: '1:1' },
  { name: '3:2', value: '3:2' },
  { name: '9:16', value: '9:16' },
];

const RESIZE_MODES = [
  { name: 'Dimensions', value: 'dimensions' },
  { name: 'Percentage', value: 'percentage' },
  { name: 'Aspect Ratio', value: 'aspect-ratio' },
];

const QUALITY_PRESETS = [
  { name: 'Maximum', value: 100 },
  { name: 'High', value: 85 },
  { name: 'Medium', value: 70 },
  { name: 'Low', value: 50 },
];

export default function ImageResizer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resizeMode, setResizeMode] = useState('dimensions');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [percentage, setPercentage] = useState(100);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('original');
  const [quality, setQuality] = useState(85);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [success, setSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [optimizeImage, setOptimizeImage] = useState(true);
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [batchMode, setBatchMode] = useState(false);
  const [batchFiles, setBatchFiles] = useState([]);

  const fileInputRef = useRef(null);
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    if (selectedAspectRatio !== 'original' && resizeMode === 'aspect-ratio') {
      const [w, h] = selectedAspectRatio.split(':').map(Number);
      const newHeight = Math.round((originalSize.width * h) / w);
      setWidth(originalSize.width.toString());
      setHeight(newHeight.toString());
    }
  }, [selectedAspectRatio, resizeMode, originalSize]);

  const handleFileSelect = (selectedFile, error) => {
    if (error) {
      setError(error);
      return;
    }

    if (batchMode) {
      setBatchFiles(prev => [...prev, selectedFile]);
      return;
    }

    setFile(selectedFile);
    setError(null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
        img.src = reader.result;
      };
      reader.readAsDataURL(selectedFile);
    } else {
      resetState();
    }
  };

  const resetState = () => {
    setImagePreview(null);
    setOriginalSize({ width: 0, height: 0 });
    setWidth('');
    setHeight('');
    setError(null);
    setSuccess(false);
  };

  const handleWidthChange = (value) => {
    setWidth(value);
    if (maintainAspectRatio && originalSize.width && originalSize.height) {
      const aspectRatio = originalSize.width / originalSize.height;
      setHeight(Math.round(value / aspectRatio).toString());
    }
  };

  const handleHeightChange = (value) => {
    setHeight(value);
    if (maintainAspectRatio && originalSize.width && originalSize.height) {
      const aspectRatio = originalSize.width / originalSize.height;
      setWidth(Math.round(value * aspectRatio).toString());
    }
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
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleResize = async () => {
    setLoading(true);
    setError(null);
    try {
      // Implement actual resize logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated delay
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
      title="Image Resizer"
      description="Resize and optimize your images with precision. Support for multiple formats and advanced controls."
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Controls */}
        <div className="space-y-6">
          {/* File Upload Area */}
          <div
            className={cn(
              "relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200",
              dragActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600",
              !file && "hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files[0])}
            accept="image/*"
              className="hidden"
            />
            
            {!file ? (
              <div>
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Upload an image
                  </button>
                  <p className="mt-1 text-gray-500">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  {file.name} ({Math.round(file.size / 1024)} KB)
                </p>
                <button
                  onClick={() => {
                    setFile(null);
                    resetState();
                  }}
                  className="text-red-500 hover:text-red-600 text-sm font-medium"
                >
                  Remove file
                </button>
              </div>
            )}
          </div>

          {/* Resize Controls */}
        {file && (
            <div className="space-y-6">
              {/* Resize Mode Selection */}
              <div className="grid grid-cols-3 gap-3">
                {RESIZE_MODES.map((mode) => (
                  <button
                    key={mode.value}
                    onClick={() => setResizeMode(mode.value)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      resizeMode === mode.value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                  >
                    {mode.name}
                  </button>
                ))}
              </div>

              {/* Dimension Controls */}
              {resizeMode === 'dimensions' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Width (px)
                    </label>
                    <input
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Height (px)
                    </label>
                    <input
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Percentage Control */}
              {resizeMode === 'percentage' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Scale Percentage
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="200"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className="w-full"
                  />
                  <div className="text-center mt-2">
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                </div>
              )}

              {/* Aspect Ratio Selection */}
              {resizeMode === 'aspect-ratio' && (
                <div className="grid grid-cols-3 gap-3">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setSelectedAspectRatio(ratio.value)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                        selectedAspectRatio === ratio.value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      )}
                    >
                      {ratio.name}
                    </button>
                  ))}
                </div>
              )}

              {/* Advanced Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintain Aspect Ratio
                  </span>
                  <button
                    onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      maintainAspectRatio ? "text-blue-500" : "text-gray-400"
                    )}
                  >
                    {maintainAspectRatio ? (
                      <LockClosedIcon className="w-5 h-5" />
                    ) : (
                      <LockOpenIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="optimize"
                    checked={optimizeImage}
                    onChange={(e) => setOptimizeImage(e.target.checked)}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="optimize"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    Optimize image
                  </label>
                </div>

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
                    Preserve metadata
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleResize}
                  disabled={loading || !file}
                  className={cn(
                    "flex-1 flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors",
                    loading
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  )}
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                      Resize & Download
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Preview */}
        <div className="relative">
          {imagePreview ? (
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img
                src={imagePreview}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span>Original: {originalSize.width} × {originalSize.height}px</span>
                  <span>New: {width} × {height}px</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                Upload an image to preview
              </p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <CheckIcon className="w-5 h-5 mr-2" />
              Image resized successfully!
            </motion.div>
          )}
        </div>
      </div>
    </ToolPage>
  );
} 