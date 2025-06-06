import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  DocumentTextIcon,
  ClipboardIcon,
  CheckIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CodeBracketIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

export default function JSONFormatter() {
  const [inputJson, setInputJson] = useState('');
  const [outputJson, setOutputJson] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [mode, setMode] = useState('beautify');
  const [stats, setStats] = useState({});

  const validateAndFormat = (json, formatMode = mode, indent = indentSize) => {
    if (!json.trim()) {
      setOutputJson('');
      setIsValid(true);
      setError('');
      setStats({});
      return;
    }

    try {
      const parsed = JSON.parse(json);
      setIsValid(true);
      setError('');

      let formatted;
      if (formatMode === 'beautify') {
        formatted = JSON.stringify(parsed, null, indent);
      } else if (formatMode === 'minify') {
        formatted = JSON.stringify(parsed);
      } else if (formatMode === 'stringify') {
        formatted = JSON.stringify(JSON.stringify(parsed, null, indent));
      }

      setOutputJson(formatted);

      // Calculate stats
      const calculateStats = (obj) => {
        let objects = 0;
        let arrays = 0;
        let properties = 0;
        let strings = 0;
        let numbers = 0;
        let booleans = 0;
        let nulls = 0;

        const traverse = (item) => {
          if (item === null) {
            nulls++;
          } else if (Array.isArray(item)) {
            arrays++;
            item.forEach(traverse);
          } else if (typeof item === 'object') {
            objects++;
            properties += Object.keys(item).length;
            Object.values(item).forEach(traverse);
          } else if (typeof item === 'string') {
            strings++;
          } else if (typeof item === 'number') {
            numbers++;
          } else if (typeof item === 'boolean') {
            booleans++;
          }
        };

        traverse(obj);
        return { objects, arrays, properties, strings, numbers, booleans, nulls };
      };

      setStats(calculateStats(parsed));
    } catch (err) {
      setIsValid(false);
      setError(err.message);
      setOutputJson('');
      setStats({});
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateAndFormat(inputJson);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputJson, mode, indentSize]);

  const copyToClipboard = async (text = outputJson) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearInput = () => {
    setInputJson('');
    setOutputJson('');
    setError('');
    setIsValid(true);
    setStats({});
  };

  const loadSample = () => {
    const sampleJson = {
      name: "John Doe",
      age: 30,
      address: {
        street: "123 Main St",
        city: "New York",
        zipCode: "10001"
      },
      hobbies: ["reading", "programming", "hiking"],
      isEmployed: true,
      spouse: null
    };
    setInputJson(JSON.stringify(sampleJson, null, 2));
  };

  const formatModes = [
    {
      id: 'beautify',
      name: 'Beautify',
      description: 'Format with proper indentation',
      icon: PlusIcon,
    },
    {
      id: 'minify',
      name: 'Minify',
      description: 'Compress to single line',
      icon: MinusIcon,
    },
    {
      id: 'stringify',
      name: 'Stringify',
      description: 'Convert to JSON string',
      icon: CodeBracketIcon,
    },
  ];

  return (
    <ToolPage
      title="JSON Formatter"
      description="Format, validate, and analyze JSON data with syntax highlighting and error detection."
    >
      <div className="space-y-8">
        {/* Mode Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Formatting Mode
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {formatModes.map((formatMode) => {
              const IconComponent = formatMode.icon;
              return (
                <button
                  key={formatMode.id}
                  onClick={() => setMode(formatMode.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                    mode === formatMode.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{formatMode.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">{formatMode.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Options */}
        {mode === 'beautify' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Formatting Options
            </h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Indent Size:
              </label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(parseInt(e.target.value))}
                className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  JSON Input
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={loadSample}
                    className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Sample
                  </button>
                  {inputJson && (
                    <button
                      onClick={clearInput}
                      className="px-3 py-1 text-sm text-red-500 hover:text-red-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={inputJson}
                onChange={(e) => setInputJson(e.target.value)}
                placeholder="Paste your JSON here..."
                className="w-full h-80 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />

              {/* Validation Status */}
              <div className="mt-4 flex items-center space-x-2">
                {inputJson ? (
                  isValid ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-500">Valid JSON</span>
                    </>
                  ) : (
                    <>
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                      <span className="text-sm text-red-500">Invalid JSON</span>
                    </>
                  )
                ) : (
                  <>
                    <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-500">Enter JSON to validate</span>
                  </>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Formatted Output
                </h3>
                {outputJson && (
                  <button
                    onClick={() => copyToClipboard()}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-1 rounded transition-colors",
                      copied
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    )}
                  >
                    {copied ? (
                      <CheckIcon className="w-4 h-4" />
                    ) : (
                      <ClipboardIcon className="w-4 h-4" />
                    )}
                    <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                )}
              </div>

              <div className="relative">
                <textarea
                  value={outputJson}
                  readOnly
                  placeholder="Formatted JSON will appear here..."
                  className="w-full h-80 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
                />
              </div>
            </div>

            {/* Statistics */}
            {Object.keys(stats).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  JSON Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{stats.objects}</p>
                    <p className="text-xs text-gray-500">Objects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{stats.arrays}</p>
                    <p className="text-xs text-gray-500">Arrays</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">{stats.properties}</p>
                    <p className="text-xs text-gray-500">Properties</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">{stats.strings}</p>
                    <p className="text-xs text-gray-500">Strings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-pink-500">{stats.numbers}</p>
                    <p className="text-xs text-gray-500">Numbers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-500">{stats.booleans + stats.nulls}</p>
                    <p className="text-xs text-gray-500">Other</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            JSON Formatter Features
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Formatting Options
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Beautify with customizable indentation</li>
                <li>• Minify for production use</li>
                <li>• Convert to JSON string format</li>
                <li>• Real-time validation and error detection</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Analysis & Tools
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Detailed JSON structure statistics</li>
                <li>• Copy formatted output instantly</li>
                <li>• Sample data for testing</li>
                <li>• Clear error messages for debugging</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
} 