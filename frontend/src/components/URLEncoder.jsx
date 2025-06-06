import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  LinkIcon,
  ClipboardIcon,
  CheckIcon,
  ArrowsRightLeftIcon,
  CodeBracketIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const ENCODING_TYPES = [
  {
    id: 'url',
    name: 'URL Encoding',
    description: 'Standard URL percent encoding',
    encode: (text) => encodeURIComponent(text),
    decode: (text) => {
      try {
        return decodeURIComponent(text);
      } catch (e) {
        return 'Invalid encoded string';
      }
    },
  },
  {
    id: 'uri',
    name: 'URI Encoding',
    description: 'Full URI encoding',
    encode: (text) => encodeURI(text),
    decode: (text) => {
      try {
        return decodeURI(text);
      } catch (e) {
        return 'Invalid encoded string';
      }
    },
  },
  {
    id: 'base64',
    name: 'Base64 Encoding',
    description: 'Base64 text encoding',
    encode: (text) => btoa(unescape(encodeURIComponent(text))),
    decode: (text) => {
      try {
        return decodeURIComponent(escape(atob(text)));
      } catch (e) {
        return 'Invalid Base64 string';
      }
    },
  },
  {
    id: 'html',
    name: 'HTML Entities',
    description: 'HTML entity encoding',
    encode: (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },
    decode: (text) => {
      const div = document.createElement('div');
      div.innerHTML = text;
      return div.textContent || div.innerText || '';
    },
  },
];

export default function URLEncoder() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedEncoding, setSelectedEncoding] = useState(ENCODING_TYPES[0]);
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [copied, setCopied] = useState(false);

  const processText = () => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    try {
      let result;
      if (mode === 'encode') {
        result = selectedEncoding.encode(inputText);
      } else {
        result = selectedEncoding.decode(inputText);
      }
      setOutputText(result);
    } catch (error) {
      setOutputText('Error processing text');
    }
  };

  useEffect(() => {
    processText();
  }, [inputText, selectedEncoding, mode]);

  const copyToClipboard = async (text = outputText) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const swapInputOutput = () => {
    setInputText(outputText);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
  };

  const loadExample = () => {
    const examples = {
      url: 'https://example.com/search?q=hello world&type=web',
      uri: 'https://example.com/path with spaces/file.html',
      base64: 'Hello, World! This is a test string.',
      html: '<p>Hello & welcome to "encoding" example!</p>',
    };
    setInputText(examples[selectedEncoding.id]);
  };

  return (
    <ToolPage
      title="URL Encoder/Decoder"
      description="Encode and decode URLs, Base64, HTML entities, and more with real-time conversion."
    >
      <div className="space-y-8">
        {/* Encoding Type Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Encoding Type
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ENCODING_TYPES.map((encoding) => (
              <button
                key={encoding.id}
                onClick={() => setSelectedEncoding(encoding)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                  selectedEncoding.id === encoding.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {encoding.name}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {encoding.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Operation Mode
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setMode('encode')}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                mode === 'encode'
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <CodeBracketIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Encode</span>
            </button>
            
            <button
              onClick={() => setMode('decode')}
              className={cn(
                "p-4 rounded-lg border-2 transition-all duration-200 text-center",
                mode === 'decode'
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <DocumentTextIcon className="w-6 h-6 mx-auto mb-2" />
              <span className="font-medium">Decode</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {mode === 'encode' ? 'Text to Encode' : 'Text to Decode'}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={loadExample}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Example
                </button>
                {inputText && (
                  <button
                    onClick={clearAll}
                    className="px-3 py-1 text-sm text-red-500 hover:text-red-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter text to ${mode}...`}
              className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Characters: {inputText.length}
              </span>
              <button
                onClick={swapInputOutput}
                disabled={!outputText}
                className={cn(
                  "flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors",
                  outputText
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                )}
              >
                <ArrowsRightLeftIcon className="w-4 h-4" />
                <span className="text-sm">Swap</span>
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {mode === 'encode' ? 'Encoded Result' : 'Decoded Result'}
              </h3>
              {outputText && (
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
                value={outputText}
                readOnly
                placeholder={`${mode === 'encode' ? 'Encoded' : 'Decoded'} text will appear here...`}
                className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none"
              />
            </div>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Characters: {outputText.length}
              </span>
              {outputText && outputText !== inputText && (
                <span className="text-sm text-blue-500">
                  {mode === 'encode' ? 'Successfully encoded' : 'Successfully decoded'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Examples */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Common Use Cases
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                URL Encoding
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Encode special characters in URLs</li>
                <li>• Prepare query parameters</li>
                <li>• Handle spaces and symbols in paths</li>
                <li>• Create safe URL strings</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Base64 Encoding
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Encode binary data for transmission</li>
                <li>• Email attachments</li>
                <li>• Data URLs for images</li>
                <li>• API token encoding</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <LinkIcon className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Encoder Features
            </h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Multiple Formats
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• URL/URI encoding</li>
                <li>• Base64 encoding</li>
                <li>• HTML entities</li>
                <li>• Real-time conversion</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                User Experience
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Instant results</li>
                <li>• Copy to clipboard</li>
                <li>• Swap input/output</li>
                <li>• Example data</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Error Handling
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Invalid input detection</li>
                <li>• Clear error messages</li>
                <li>• Safe character handling</li>
                <li>• UTF-8 support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
} 