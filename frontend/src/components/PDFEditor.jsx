import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  PencilIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  PlayIcon,
  PlusIcon,
  MinusIcon,
  PhotoIcon,
  DocumentDuplicateIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  CursorArrowRaysIcon,
  Square2StackIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';

const EDIT_TOOLS = [
  {
    id: 'text',
    name: 'Text Editor',
    description: 'Edit or add text to PDF',
    icon: DocumentTextIcon,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'draw',
    name: 'Draw & Annotate',
    description: 'Freehand drawing and shapes',
    icon: PencilIcon,
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Add or edit images',
    icon: PhotoIcon,
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'forms',
    name: 'Form Fields',
    description: 'Create interactive forms',
    icon: Square2StackIcon,
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'comments',
    name: 'Comments',
    description: 'Add review comments',
    icon: ChatBubbleLeftIcon,
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    id: 'arrange',
    name: 'Arrange',
    description: 'Organize pages and content',
    icon: AdjustmentsHorizontalIcon,
    color: 'from-indigo-500 to-indigo-600',
  },
];

const FORM_FIELD_TYPES = [
  { id: 'text', name: 'Text Field', icon: DocumentTextIcon },
  { id: 'checkbox', name: 'Checkbox', icon: CheckCircleIcon },
  { id: 'radio', name: 'Radio Button', icon: CursorArrowRaysIcon },
  { id: 'dropdown', name: 'Dropdown', icon: ArrowsPointingOutIcon },
  { id: 'signature', name: 'Signature', icon: PencilIcon },
];

export default function PDFEditor() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [annotations, setAnnotations] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

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
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type === 'application/pdf') {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0 && files[0].type === 'application/pdf') {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPageCount();
      
      setFile(file);
      setPageCount(pages);
      setCurrentPage(1);
      setAnnotations([]);
      setFormFields([]);
      
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const addAnnotation = (type, data) => {
    setAnnotations(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      data,
      page: currentPage
    }]);
  };

  const addFormField = (type, position) => {
    setFormFields(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      type,
      position,
      page: currentPage,
      properties: {}
    }]);
  };

  const savePDF = async () => {
    if (!file) return;
    
    try {
      setProcessing(true);
      
      // Load the PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Apply annotations and form fields
      // This is a simplified version - in a real implementation,
      // you would need to properly apply all edits to the PDF
      
      const pdfBytes = await pdfDoc.save();
      
      // Download the edited PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error saving PDF:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPage
      title="PDF Editor"
      description="Advanced PDF editor with text editing, annotations, and form creation capabilities."
    >
      <div className="space-y-8">
        {/* Upload Area */}
        {!file && (
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
                  Drop a PDF file here to edit
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Open a PDF file to start editing
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  <PencilIcon className="w-5 h-5 mr-2" />
                  Choose PDF File
                </button>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        )}

        {file && (
          <div className="flex space-x-6">
            {/* Tools Sidebar */}
            <div className="w-64 flex-shrink-0 space-y-6">
              {/* File Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="w-8 h-8 text-red-500" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Edit Tools */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Edit Tools
                </h3>
                <div className="space-y-2">
                  {EDIT_TOOLS.map((tool) => {
                    const IconComponent = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200",
                          selectedTool === tool.id
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                        )}
                      >
                        <IconComponent className="w-5 h-5" />
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium">{tool.name}</p>
                          <p className="text-xs text-gray-500">
                            {tool.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Fields */}
              {selectedTool === 'forms' && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                    Form Fields
                  </h3>
                  <div className="space-y-2">
                    {FORM_FIELD_TYPES.map((field) => {
                      const IconComponent = field.icon;
                      return (
                        <button
                          key={field.id}
                          onClick={() => addFormField(field.id, { x: 0, y: 0 })}
                          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {field.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={savePDF}
                disabled={processing}
                className={cn(
                  "w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-medium transition-all duration-200",
                  processing
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                )}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                    Save PDF
                  </>
                )}
              </button>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {/* Page Navigation */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-sm">
                      Page {currentPage} of {pageCount}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
                      disabled={currentPage === pageCount}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setZoom(prev => Math.max(25, prev - 25))}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowsPointingInIcon className="w-5 h-5" />
                    </button>
                    <span className="text-sm">{zoom}%</span>
                    <button
                      onClick={() => setZoom(prev => Math.min(200, prev + 25))}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <ArrowsPointingOutIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Canvas */}
              <div
                className="relative bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden"
                style={{ height: 'calc(100vh - 300px)' }}
              >
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    transformOrigin: 'top left'
                  }}
                />
                
                {/* Annotations Layer */}
                <div className="absolute inset-0">
                  {annotations
                    .filter(a => a.page === currentPage)
                    .map(annotation => (
                      <div
                        key={annotation.id}
                        className="absolute"
                        style={{
                          left: annotation.data.x,
                          top: annotation.data.y
                        }}
                      >
                        {/* Annotation content would go here */}
                      </div>
                    ))}
                </div>

                {/* Form Fields Layer */}
                <div className="absolute inset-0">
                  {formFields
                    .filter(f => f.page === currentPage)
                    .map(field => (
                      <div
                        key={field.id}
                        className="absolute"
                        style={{
                          left: field.position.x,
                          top: field.position.y
                        }}
                      >
                        {/* Form field content would go here */}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <PencilIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Rich Editing
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Edit text, add images, and annotate PDFs
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Square2StackIcon className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Form Creation
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create interactive PDF forms easily
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ChatBubbleLeftIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Annotations
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add comments and review markups
            </p>
          </div>
        </div>
      </div>
    </ToolPage>
  );
} 