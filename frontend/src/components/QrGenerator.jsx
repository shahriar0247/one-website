import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCodeIcon, ArrowDownTrayIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import QRCode from 'qrcode';
import { cn } from '../utils/cn';

export default function QrGenerator() {
  const [text, setText] = useState('');
  const [qrDataURL, setQrDataURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState('M');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const generateQR = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const dataURL = await QRCode.toDataURL(text, {
        width: size,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      });
      setQrDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (text.trim()) {
      generateQR();
    } else {
      setQrDataURL('');
    }
  }, [text, size, errorLevel, foregroundColor, backgroundColor]);

  const downloadQR = () => {
    if (!qrDataURL) return;
    
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataURL;
    link.click();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="glass-card overflow-hidden">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mr-4">
                <QrCodeIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
                  QR Generator
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                  Generate QR codes for text, URLs, and more
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Content
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Text or URL
                    </label>
                    <div className="relative">
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter text, URL, or any content for the QR code..."
                        className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                      {text && (
                        <button
                          onClick={copyToClipboard}
                          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Customization Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Customization
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Size
                      </label>
                      <select
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value={128}>128px</option>
                        <option value={256}>256px</option>
                        <option value={512}>512px</option>
                        <option value={1024}>1024px</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Error Correction
                      </label>
                      <select
                        value={errorLevel}
                        onChange={(e) => setErrorLevel(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="L">Low</option>
                        <option value="M">Medium</option>
                        <option value="Q">Quartile</option>
                        <option value="H">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Foreground Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="w-12 h-10 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={foregroundColor}
                          onChange={(e) => setForegroundColor(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Background Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-12 h-10 border border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* QR Code Display */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Generated QR Code
                  </h3>
                  {qrDataURL && (
                    <button
                      onClick={downloadQR}
                      className="btn-primary text-sm inline-flex items-center"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  )}
                </div>
                
                <div className="flex items-center justify-center min-h-[300px] bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600 dark:text-gray-400">Generating QR code...</span>
                    </div>
                  ) : qrDataURL ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <img
                        src={qrDataURL}
                        alt="Generated QR Code"
                        className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                        Size: {size}x{size}px • Error Correction: {errorLevel}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="text-center">
                      <QrCodeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Enter content to generate QR code
                      </h4>
                      <p className="text-gray-500 dark:text-gray-500">
                        Type any text or URL above to create your QR code
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Presets */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Quick Examples
                </h3>
                <div className="space-y-2">
                  {[
                    'https://example.com',
                    'mailto:contact@example.com',
                    'tel:+1234567890',
                    'WiFi:T:WPA;S:NetworkName;P:password;;'
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setText(example)}
                      className="block w-full text-left px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 