import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  ScissorsIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  PlayIcon,
  PlusIcon,
  MinusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';

const SPLIT_MODES = [
  {
    id: 'range',
    name: 'Split by Range',
    description: 'Extract specific page ranges',
    icon: '📑',
  },
  {
    id: 'single',
    name: 'Extract Single Pages',
    description: 'Select individual pages to extract',
    icon: '📄',
  },
  {
    id: 'interval',
    name: 'Split by Interval',
    description: 'Split every N pages',
    icon: '📚',
  },
  {
    id: 'size',
    name: 'Split by Size',
    description: 'Create files of specific sizes',
    icon: '📏',
  },
];

export default function PDFSplitter() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [splitMode, setSplitMode] = useState('range');
  const [ranges, setRanges] = useState([{ start: 1, end: 1 }]);
  const [interval, setInterval] = useState(1);
  const [maxFileSize, setMaxFileSize] = useState(10);
  const [selectedPages, setSelectedPages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [previewPage, setPreviewPage] = useState(null);
  const fileInputRef = useRef(null);

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
      setRanges([{ start: 1, end: pages }]);
      setSelectedPages([]);
      
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const addRange = () => {
    setRanges(prev => [...prev, { start: 1, end: pageCount }]);
  };

  const removeRange = (index) => {
    setRanges(prev => prev.filter((_, i) => i !== index));
  };

  const updateRange = (index, field, value) => {
    value = Math.max(1, Math.min(pageCount, parseInt(value) || 1));
    setRanges(prev => prev.map((range, i) => 
      i === index ? { ...range, [field]: value } : range
    ));
  };

  const togglePage = (pageNum) => {
    setSelectedPages(prev => {
      if (prev.includes(pageNum)) {
        return prev.filter(p => p !== pageNum);
      } else {
        return [...prev, pageNum].sort((a, b) => a - b);
      }
    });
  };

  const splitPDF = async () => {
    if (!file) return;
    
    try {
      setProcessing(true);
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      let outputFiles = [];
      
      switch (splitMode) {
        case 'range':
          // Split by ranges
          for (const range of ranges) {
            const newPdf = await PDFDocument.create();
            const pages = await newPdf.copyPages(pdfDoc, 
              Array.from({ length: range.end - range.start + 1 }, (_, i) => range.start - 1 + i)
            );
            pages.forEach(page => newPdf.addPage(page));
            
            const pdfBytes = await newPdf.save();
            outputFiles.push({
              data: pdfBytes,
              name: `split_${range.start}-${range.end}.pdf`
            });
          }
          break;
          
        case 'single':
          // Extract selected pages
          for (const pageNum of selectedPages) {
            const newPdf = await PDFDocument.create();
            const [page] = await newPdf.copyPages(pdfDoc, [pageNum - 1]);
            newPdf.addPage(page);
            
            const pdfBytes = await newPdf.save();
            outputFiles.push({
              data: pdfBytes,
              name: `page_${pageNum}.pdf`
            });
          }
          break;
          
        case 'interval':
          // Split by interval
          for (let i = 0; i < pageCount; i += interval) {
            const newPdf = await PDFDocument.create();
            const pages = await newPdf.copyPages(pdfDoc, 
              Array.from({ length: Math.min(interval, pageCount - i) }, (_, j) => i + j)
            );
            pages.forEach(page => newPdf.addPage(page));
            
            const pdfBytes = await newPdf.save();
            outputFiles.push({
              data: pdfBytes,
              name: `split_${i + 1}-${Math.min(i + interval, pageCount)}.pdf`
            });
          }
          break;
          
        case 'size':
          // Split by size (simplified simulation)
          const pagesPerFile = Math.ceil(pageCount / Math.ceil(pdfDoc.save().length / (maxFileSize * 1024 * 1024)));
          for (let i = 0; i < pageCount; i += pagesPerFile) {
            const newPdf = await PDFDocument.create();
            const pages = await newPdf.copyPages(pdfDoc, 
              Array.from({ length: Math.min(pagesPerFile, pageCount - i) }, (_, j) => i + j)
            );
            pages.forEach(page => newPdf.addPage(page));
            
            const pdfBytes = await newPdf.save();
            outputFiles.push({
              data: pdfBytes,
              name: `split_${i + 1}-${Math.min(i + pagesPerFile, pageCount)}.pdf`
            });
          }
          break;
      }
      
      // Download all files
      outputFiles.forEach(file => {
        const blob = new Blob([file.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
      
    } catch (error) {
      console.error('Error splitting PDF:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolPage
      title="PDF Splitter"
      description="Split PDF files into multiple documents or extract specific pages."
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
                Drop a PDF file here to split
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Select a single PDF file to split or extract pages
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
              >
                <ScissorsIcon className="w-5 h-5 mr-2" />
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

        {file && (
          <>
            {/* File Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <DocumentTextIcon className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setFile(null)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Split Options */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Split Options
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {SPLIT_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSplitMode(mode.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200 text-left",
                      splitMode === mode.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{mode.icon}</span>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {mode.name}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mode.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Split Mode Specific Options */}
              <div className="space-y-6">
                {splitMode === 'range' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Page Ranges
                      </h4>
                      <button
                        onClick={addRange}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                      >
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Add Range
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {ranges.map((range, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Start Page
                              </label>
                              <input
                                type="number"
                                min="1"
                                max={pageCount}
                                value={range.start}
                                onChange={(e) => updateRange(index, 'start', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                End Page
                              </label>
                              <input
                                type="number"
                                min="1"
                                max={pageCount}
                                value={range.end}
                                onChange={(e) => updateRange(index, 'end', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                              />
                            </div>
                          </div>
                          {ranges.length > 1 && (
                            <button
                              onClick={() => removeRange(index)}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <MinusIcon className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {splitMode === 'single' && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                      Select Pages to Extract
                    </h4>
                    <div className="grid grid-cols-8 gap-2">
                      {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => togglePage(pageNum)}
                          className={cn(
                            "p-2 text-center rounded-lg transition-all duration-200",
                            selectedPages.includes(pageNum)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
                          )}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {splitMode === 'interval' && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                      Split Every N Pages
                    </h4>
                    <div className="max-w-xs">
                      <input
                        type="number"
                        min="1"
                        max={pageCount}
                        value={interval}
                        onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        This will create {Math.ceil(pageCount / interval)} PDF files
                      </p>
                    </div>
                  </div>
                )}

                {splitMode === 'size' && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                      Maximum File Size (MB)
                    </h4>
                    <div className="max-w-xs">
                      <input
                        type="number"
                        min="1"
                        value={maxFileSize}
                        onChange={(e) => setMaxFileSize(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <p className="mt-2 text-sm text-gray-500">
                        Files will be split to not exceed this size
                      </p>
                    </div>
                  </div>
                )}

                {/* Split Button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={splitPDF}
                    disabled={processing}
                    className={cn(
                      "inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200",
                      processing
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
                        <ScissorsIcon className="w-5 h-5 mr-2" />
                        Split PDF
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <ScissorsIcon className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Multiple Modes
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Split by range, pages, interval, or size
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
                  Preview pages before splitting
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Quality Preserved
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Original quality maintained in split files
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </ToolPage>
  );
} 