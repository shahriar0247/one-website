import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  DocumentDuplicateIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
  TrashIcon,
  EyeIcon,
  ChevronUpDownIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XMarkIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';

const SortableItem = ({ id, file, onRemove, onPreview }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            {...attributes}
            {...listeners}
          >
            <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
          </button>
          
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
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPreview(file)}
            className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => onRemove(id)}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function PDFMerger() {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (droppedFiles.length > 0) {
      const newFiles = droppedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (selectedFiles.length > 0) {
      const newFiles = selectedFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setFiles((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newItems = [...items];
        const [removed] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, removed);
        
        return newItems;
      });
    }
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;
    
    try {
      setProcessing(true);
      
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();
      
      // Process each PDF file
      for (const fileObj of files) {
        const fileBytes = await fileObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        
        // Copy all pages
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }
      
      // Save the merged PDF
      const mergedBytes = await mergedPdf.save();
      
      // Create download link
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error merging PDFs:', error);
    } finally {
      setProcessing(false);
    }
  };

  const previewPDF = (fileObj) => {
    setPreviewFile(fileObj);
  };

  return (
    <ToolPage
      title="PDF Merger"
      description="Combine multiple PDF files into one with our intuitive drag-and-drop interface."
    >
      <div className="space-y-8">
        {/* Upload Area */}
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
                Drop PDF files here to merge
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Drag and drop multiple PDF files, or click to select
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                <DocumentDuplicateIcon className="w-5 h-5 mr-2" />
                Choose PDF Files
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

        {/* Files List */}
        {files.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  PDF Files to Merge ({files.length})
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Drag files to reorder them
                </p>
              </div>
              
              <button
                onClick={mergePDFs}
                disabled={files.length < 2 || processing}
                className={cn(
                  "inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200",
                  files.length < 2 || processing
                    ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                )}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-5 h-5 mr-2" />
                    Merge PDFs
                  </>
                )}
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={files.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {files.map((file) => (
                    <SortableItem
                      key={file.id}
                      id={file.id}
                      file={file}
                      onRemove={removeFile}
                      onPreview={previewPDF}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ArrowsUpDownIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Drag & Drop
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Easily reorder files by dragging them into position
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <EyeIcon className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Preview
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Preview PDFs before merging to ensure correct order
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <DocumentDuplicateIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Smart Merge
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Maintains original quality and formatting
            </p>
          </div>
        </div>

        {/* Preview Modal */}
        {previewFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-4xl w-full mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Preview: {previewFile.name}
                </h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              
              <div className="h-[600px] bg-gray-100 dark:bg-gray-900 rounded-lg">
                {/* PDF Preview would go here - requires additional PDF viewer component */}
                <div className="flex items-center justify-center h-full text-gray-500">
                  PDF Preview Coming Soon
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolPage>
  );
} 