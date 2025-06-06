import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  HashtagIcon,
  ClipboardIcon,
  CheckIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

const HASH_ALGORITHMS = [
  {
    id: 'sha-1',
    name: 'SHA-1',
    description: 'Legacy, not recommended',
    outputLength: 40,
    color: 'text-orange-500',
  },
  {
    id: 'sha-256',
    name: 'SHA-256',
    description: 'Most commonly used',
    outputLength: 64,
    color: 'text-green-500',
  },
  {
    id: 'sha-384',
    name: 'SHA-384',
    description: 'Good security',
    outputLength: 96,
    color: 'text-blue-500',
  },
  {
    id: 'sha-512',
    name: 'SHA-512',
    description: 'Most secure',
    outputLength: 128,
    color: 'text-purple-500',
  },
];

export default function HashGenerator() {
  const [inputText, setInputText] = useState('');
  const [selectedAlgorithms, setSelectedAlgorithms] = useState(['sha-256']);
  const [hashes, setHashes] = useState({});
  const [copied, setCopied] = useState('');
  const [inputMethod, setInputMethod] = useState('text'); // 'text' or 'file'
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Convert ArrayBuffer to hex string
  const bufferToHex = (buffer) => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const generateHashes = async (input) => {
    if (!input) {
      setHashes({});
      return;
    }

    setLoading(true);
    const newHashes = {};
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      for (const algorithm of selectedAlgorithms) {
        try {
          const hashBuffer = await crypto.subtle.digest(algorithm.toUpperCase(), data);
          const hashHex = bufferToHex(hashBuffer);
          newHashes[algorithm] = hashHex;
        } catch (error) {
          console.error(`Error generating ${algorithm} hash:`, error);
          newHashes[algorithm] = 'Error generating hash';
        }
      }
    } catch (error) {
      console.error('Error in hash generation:', error);
    }

    setHashes(newHashes);
    setLoading(false);
  };

  useEffect(() => {
    if (inputMethod === 'text' && inputText) {
      generateHashes(inputText);
    }
  }, [inputText, selectedAlgorithms, inputMethod]);

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Read file as text for hashing
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        generateHashes(content);
      };
      reader.readAsText(selectedFile);
    }
  };

  const copyToClipboard = async (hash, algorithm) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(algorithm);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy hash:', err);
    }
  };

  const toggleAlgorithm = (algorithm) => {
    setSelectedAlgorithms(prev => {
      if (prev.includes(algorithm)) {
        return prev.filter(a => a !== algorithm);
      } else {
        return [...prev, algorithm];
      }
    });
  };

  const clearAll = () => {
    setInputText('');
    setFile(null);
    setHashes({});
  };

  return (
    <ToolPage
      title="Hash Generator"
      description="Generate secure hashes using various algorithms like SHA-256, SHA-512, and more."
    >
      <div className="space-y-8">
        {/* Algorithm Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Hash Algorithms
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HASH_ALGORITHMS.map((algorithm) => (
              <label
                key={algorithm.id}
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                  selectedAlgorithms.includes(algorithm.id)
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <input
                  type="checkbox"
                  checked={selectedAlgorithms.includes(algorithm.id)}
                  onChange={() => toggleAlgorithm(algorithm.id)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className={cn("font-medium", algorithm.color)}>
                    {algorithm.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {algorithm.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Input Method Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Input Method
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setInputMethod('text')}
              className={cn(
                "p-3 rounded-lg border-2 transition-all duration-200",
                inputMethod === 'text'
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <DocumentTextIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Text Input</span>
            </button>
            
            <button
              onClick={() => setInputMethod('file')}
              className={cn(
                "p-3 rounded-lg border-2 transition-all duration-200",
                inputMethod === 'file'
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <HashtagIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">File Input</span>
            </button>
          </div>

          {/* Text Input */}
          {inputMethod === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter text to hash
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          )}

          {/* File Input */}
          {inputMethod === 'file' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select file to hash
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {file && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>
          )}

          {/* Clear Button */}
          {(inputText || file) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearAll}
                className="px-4 py-2 text-sm text-red-500 hover:text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Hash Results */}
        {(Object.keys(hashes).length > 0 || loading) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              Generated Hashes
            </h3>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-500 mt-2">Generating hashes...</p>
              </div>
            )}

            {!loading && (
              <div className="space-y-4">
                {selectedAlgorithms.map((algorithmId) => {
                  const algorithm = HASH_ALGORITHMS.find(a => a.id === algorithmId);
                  const hash = hashes[algorithmId];
                  
                  if (!hash) return null;

                  return (
                    <motion.div
                      key={algorithmId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={cn("font-medium", algorithm.color)}>
                            {algorithm.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({algorithm.outputLength} chars)
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(hash, algorithmId)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            copied === algorithmId
                              ? "text-green-500 bg-green-50 dark:bg-green-900/20"
                              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          )}
                        >
                          {copied === algorithmId ? (
                            <CheckIcon className="w-5 h-5" />
                          ) : (
                            <ClipboardIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                        <code className="text-sm font-mono break-all text-gray-900 dark:text-white">
                          {hash}
                        </code>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Information & Security */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ShieldCheckIcon className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Hash Algorithm Information
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Use Cases
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Password verification (with salt)</li>
                <li>• File integrity checking</li>
                <li>• Digital signatures</li>
                <li>• Data deduplication</li>
                <li>• Blockchain and cryptocurrency</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Security Notes
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• SHA-1 is cryptographically broken</li>
                <li>• SHA-256/SHA-512 are currently secure</li>
                <li>• Always use salt for password hashing</li>
                <li>• Consider bcrypt/scrypt for passwords</li>
                <li>• Hashes are one-way functions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
} 