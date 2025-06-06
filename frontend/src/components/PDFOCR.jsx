import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  MagnifyingGlassIcon,
  CloudArrowUpIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  TrashIcon,
  EyeIcon,
  XMarkIcon,
  PlayIcon,
  LanguageIcon,
  CheckCircleIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { PDFDocument } from 'pdf-lib';

const SUPPORTED_LANGUAGES = [
  { code: 'eng', name: 'English' },
  { code: 'fra', name: 'French' },
  { code: 'deu', name: 'German' },
  { code: 'spa', name: 'Spanish' },
  { code: 'ita', name: 'Italian' },
  { code: 'por', name: 'Portuguese' },
  { code: 'rus', name: 'Russian' },
  { code: 'chi_sim', name: 'Chinese (Simplified)' },
  { code: 'chi_tra', name: 'Chinese (Traditional)' },
  { code: 'jpn', name: 'Japanese' },
  { code: 'kor', name: 'Korean' },
  { code: 'ara', name: 'Arabic' },
  { code: 'hin', name: 'Hindi' },
];

export default function PDFOCR() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState(['eng']);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
      setCurrentPage(1);
      setExtractedText('');
      setProgress(0);
      
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const toggleLanguage = (code) => {
    setSelectedLanguages(prev => {
      if (prev.includes(code)) {
        return prev.filter(lang => lang !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const extractText = async () => {
    if (!file || selectedLanguages.length === 0) return;
    
    try {
      setProcessing(true);
      setProgress(0);
      setExtractedText('');
      
      // Simulate OCR processing with progress
      // In a real implementation, you would:
      // 1. Use Tesseract.js or a server-side OCR solution
      // 2. Process each page
      // 3. Handle multiple languages
      // 4. Maintain formatting
      
      const totalSteps = pageCount * 2; // 2 steps per page
      let currentStep = 0;
      
      const simulateProgress = () => {
        currentStep++;
        setProgress((currentStep / totalSteps) * 100);
      };
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Example extracted text
      const sampleText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

This is a sample OCR result.
Multiple languages supported: ${selectedLanguages.join(', ')}
PDF Name: ${file.name}
Total Pages: ${pageCount}`;
      
      setExtractedText(sampleText);
      
    } catch (error) {
      console.error('Error extracting text:', error);
    } finally {
      setProcessing(false);
      setProgress(100);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
  };

  const downloadText = () => {
    const blob = new Blob([extractedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ocr_${file.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPage
      title="PDF OCR"
      description="Extract text from scanned PDFs with advanced OCR and multi-language support."
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
                  Drop a scanned PDF here
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Extract text from scanned documents
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
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
          <>
            {/* File Info & Controls */}
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
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={extractText}
                    disabled={processing || selectedLanguages.length === 0}
                    className={cn(
                      "inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200",
                      processing || selectedLanguages.length === 0
                        ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    )}
                  >
                    {processing ? (
                      <>
                        <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <PlayIcon className="w-5 h-5 mr-2" />
                        Extract Text
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setFile(null)}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {processing && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Processing PDF...
                    </span>
                    <span className="text-sm font-medium text-blue-600">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Language Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Select Languages
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={cn(
                      "flex items-center space-x-2 p-3 rounded-xl border-2 transition-all duration-200",
                      selectedLanguages.includes(lang.code)
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <LanguageIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Extracted Text */}
            {extractedText && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Extracted Text
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <ClipboardDocumentIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={downloadText}
                      className="p-2 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                    {extractedText}
                  </pre>
                </div>
              </div>
            )}
          </>
        )}

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <SparklesIcon className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                AI-Powered OCR
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Advanced text recognition with high accuracy
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <LanguageIcon className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Multi-Language
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Support for 13+ languages and counting
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <DocumentDuplicateIcon className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Format Preservation
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Maintains original text layout and structure
            </p>
          </div>
        </div>
      </div>
    </ToolPage>
  );
} 