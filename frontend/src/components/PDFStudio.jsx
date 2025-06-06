import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  DocumentTextIcon,
  CloudArrowUpIcon,
  PlusIcon,
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  ShieldCheckIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ScissorsIcon,
  LockClosedIcon,
  LockOpenIcon,
  PhotoIcon,
  CursorArrowRaysIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  UserGroupIcon,
  SparklesIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const PDF_TOOLS = [
  {
    id: 'viewer',
    name: 'PDF Viewer',
    description: 'Advanced PDF viewer with annotations',
    icon: EyeIcon,
    color: 'from-blue-500 to-blue-600',
    category: 'view',
    features: ['Zoom controls', 'Page navigation', 'Search', 'Annotations']
  },
  {
    id: 'editor',
    name: 'PDF Editor',
    description: 'Edit text, images, and forms in PDFs',
    icon: PencilIcon,
    color: 'from-green-500 to-green-600',
    category: 'edit',
    features: ['Text editing', 'Image insertion', 'Form filling', 'Annotations']
  },
  {
    id: 'converter',
    name: 'PDF Converter',
    description: 'Convert PDFs to/from various formats',
    icon: ArrowDownTrayIcon,
    color: 'from-purple-500 to-purple-600',
    category: 'convert',
    features: ['Word/Excel/PPT', 'Images', 'HTML', 'Text extraction']
  },
  {
    id: 'compressor',
    name: 'PDF Compressor',
    description: 'Reduce file size with smart compression',
    icon: AdjustmentsHorizontalIcon,
    color: 'from-orange-500 to-orange-600',
    category: 'optimize',
    features: ['Smart compression', 'Quality control', 'Batch processing', 'Size analysis']
  },
  {
    id: 'merger',
    name: 'PDF Merger',
    description: 'Combine multiple PDFs into one',
    icon: DocumentDuplicateIcon,
    color: 'from-indigo-500 to-indigo-600',
    category: 'organize',
    features: ['Drag & drop', 'Page preview', 'Custom order', 'Bookmarks']
  },
  {
    id: 'splitter',
    name: 'PDF Splitter',
    description: 'Extract pages or split into multiple files',
    icon: ScissorsIcon,
    color: 'from-red-500 to-red-600',
    category: 'organize',
    features: ['Page ranges', 'Split by size', 'Extract pages', 'Batch splitting']
  },
  {
    id: 'organizer',
    name: 'PDF Organizer',
    description: 'Reorder, rotate, and manage pages',
    icon: Squares2X2Icon,
    color: 'from-teal-500 to-teal-600',
    category: 'organize',
    features: ['Page reordering', 'Rotation', 'Deletion', 'Duplication']
  },
  {
    id: 'protector',
    name: 'PDF Protector',
    description: 'Add passwords and security settings',
    icon: LockClosedIcon,
    color: 'from-gray-500 to-gray-600',
    category: 'security',
    features: ['Password protection', 'Permissions', 'Encryption', 'Digital rights']
  },
  {
    id: 'unlocker',
    name: 'PDF Unlocker',
    description: 'Remove passwords from PDFs',
    icon: LockOpenIcon,
    color: 'from-yellow-500 to-yellow-600',
    category: 'security',
    features: ['Password removal', 'Permission unlocking', 'Authorized access', 'Batch unlock']
  },
  {
    id: 'watermark',
    name: 'PDF Watermark',
    description: 'Add text or image watermarks',
    icon: PhotoIcon,
    color: 'from-pink-500 to-pink-600',
    category: 'enhance',
    features: ['Text watermarks', 'Image watermarks', 'Positioning', 'Transparency']
  },
  {
    id: 'signer',
    name: 'PDF Signer',
    description: 'Add digital signatures and certificates',
    icon: CursorArrowRaysIcon,
    color: 'from-emerald-500 to-emerald-600',
    category: 'security',
    features: ['Digital signatures', 'Certificates', 'Validation', 'Timestamping']
  },
  {
    id: 'forms',
    name: 'PDF Forms',
    description: 'Create and fill interactive forms',
    icon: ListBulletIcon,
    color: 'from-violet-500 to-violet-600',
    category: 'forms',
    features: ['Form creation', 'Field types', 'Validation', 'Data export']
  },
  {
    id: 'ocr',
    name: 'PDF OCR',
    description: 'Extract text from scanned documents',
    icon: MagnifyingGlassIcon,
    color: 'from-cyan-500 to-cyan-600',
    category: 'ai',
    features: ['Text recognition', 'Multiple languages', 'Searchable PDFs', 'Text extraction']
  },
  {
    id: 'analytics',
    name: 'PDF Analytics',
    description: 'Analyze document content and properties',
    icon: ChartBarIcon,
    color: 'from-rose-500 to-rose-600',
    category: 'ai',
    features: ['Content analysis', 'Readability score', 'Security audit', 'Accessibility check']
  },
  {
    id: 'ai-tools',
    name: 'AI PDF Tools',
    description: 'AI-powered PDF enhancements',
    icon: SparklesIcon,
    color: 'from-fuchsia-500 to-fuchsia-600',
    category: 'ai',
    features: ['Auto-summarization', 'Smart compression', 'Content extraction', 'Translation']
  }
];

const CATEGORIES = [
  { id: 'all', name: 'All Tools', icon: Squares2X2Icon },
  { id: 'view', name: 'View & Read', icon: EyeIcon },
  { id: 'edit', name: 'Edit & Modify', icon: PencilIcon },
  { id: 'convert', name: 'Convert', icon: ArrowDownTrayIcon },
  { id: 'organize', name: 'Organize', icon: DocumentDuplicateIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  { id: 'enhance', name: 'Enhance', icon: PhotoIcon },
  { id: 'forms', name: 'Forms', icon: ListBulletIcon },
  { id: 'ai', name: 'AI Tools', icon: SparklesIcon },
];

export default function PDFStudio() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const filteredTools = selectedCategory === 'all' 
    ? PDF_TOOLS 
    : PDF_TOOLS.filter(tool => tool.category === selectedCategory);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const openTool = (tool) => {
    setSelectedTool(tool);
  };

  return (
    <ToolPage
      title="PDF Studio"
      description="Complete PDF editing suite with AI-powered tools, advanced editing, and professional features."
    >
      <div className="space-y-8">
        {/* File Upload Area */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300",
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Drop PDF files here or click to upload
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Support for multiple files, batch processing available
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Choose Files
              </button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="w-8 h-8 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Tool Categories
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {CATEGORIES.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-lg transition-all duration-200",
                    selectedCategory === category.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  )}
                >
                  <IconComponent className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => openTool(tool)}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "p-3 rounded-xl bg-gradient-to-r text-white",
                        tool.color
                      )}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">
                          {tool.features.length} features
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {tool.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Key Features
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {tool.features.slice(0, 3).map((feature, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          >
                            {feature}
                          </span>
                        ))}
                        {tool.features.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{tool.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Stats & Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  15+ PDF Tools
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete PDF suite
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  AI-Powered
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Smart automation
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Collaborative
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Team features
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Why Choose Our PDF Studio?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl mb-4">
                <SparklesIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                AI-Enhanced
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Smart compression, auto-OCR, and intelligent content analysis
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Secure & Private
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Client-side processing, no data uploads, complete privacy
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl mb-4">
                <DocumentDuplicateIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Batch Processing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Handle multiple files simultaneously for maximum efficiency
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-xl mb-4">
                <CursorArrowRaysIcon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Intuitive Design
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drag-and-drop interface with real-time preview and feedback
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Modal/Panel would go here */}
      {selectedTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-4">{selectedTool.name}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {selectedTool.description}
            </p>
            <p className="text-sm text-blue-600 mb-6">
              This tool is under development. Coming soon with full functionality!
            </p>
            <button
              onClick={() => setSelectedTool(null)}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </ToolPage>
  );
} 