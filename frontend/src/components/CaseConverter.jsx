import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { cn } from '../utils/cn';

const caseOptions = [
  {
    label: 'UPPERCASE',
    description: 'Convert to UPPERCASE letters',
    transform: (text) => text.toUpperCase(),
    example: 'HELLO WORLD',
    color: 'from-red-500 to-red-600'
  },
  {
    label: 'lowercase',
    description: 'Convert to lowercase letters',
    transform: (text) => text.toLowerCase(),
    example: 'hello world',
    color: 'from-blue-500 to-blue-600'
  },
  {
    label: 'Title Case',
    description: 'Capitalize First Letter Of Each Word',
    transform: (text) => text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ),
    example: 'Hello World',
    color: 'from-green-500 to-green-600'
  },
  {
    label: 'Sentence case',
    description: 'Capitalize first letter of sentences',
    transform: (text) => text.toLowerCase().replace(/(^\w|\. \w)/g, 
      (match) => match.toUpperCase()
    ),
    example: 'Hello world. This is a sentence.',
    color: 'from-purple-500 to-purple-600'
  },
  {
    label: 'camelCase',
    description: 'Convert to camelCase format',
    transform: (text) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    ).replace(/\s+/g, ''),
    example: 'helloWorld',
    color: 'from-orange-500 to-orange-600'
  },
  {
    label: 'snake_case',
    description: 'Convert to snake_case format',
    transform: (text) => text.toLowerCase().replace(/\s+/g, '_'),
    example: 'hello_world',
    color: 'from-teal-500 to-teal-600'
  },
  {
    label: 'kebab-case',
    description: 'Convert to kebab-case format',
    transform: (text) => text.toLowerCase().replace(/\s+/g, '-'),
    example: 'hello-world',
    color: 'from-pink-500 to-pink-600'
  },
  {
    label: 'PascalCase',
    description: 'Convert to PascalCase format',
    transform: (text) => text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) =>
      word.toUpperCase()
    ).replace(/\s+/g, ''),
    example: 'HelloWorld',
    color: 'from-indigo-500 to-indigo-600'
  }
];

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [copiedCase, setCopiedCase] = useState(null);

  const handleCopy = async (convertedText, caseType) => {
    try {
      await navigator.clipboard.writeText(convertedText);
      setCopiedCase(caseType);
      setTimeout(() => setCopiedCase(null), 2000);
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
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold gradient-text">
                  Case Converter
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                  Transform text between different letter cases and formats
                </p>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="glass-card p-6">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Enter your text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here to convert between different cases..."
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-lg"
              />
              {text && (
                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  Characters: {text.length} • Words: {text.trim().split(/\s+/).filter(Boolean).length}
                </div>
              )}
            </div>
          </motion.div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {caseOptions.map((option, index) => {
              const convertedText = text ? option.transform(text) : option.example;
              const isConverted = Boolean(text);
              
              return (
                <motion.div
                  key={option.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="glass-card p-6 group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r",
                      option.color
                    )}>
                      {option.label}
                    </div>
                    {isConverted && (
                      <motion.button
                        onClick={() => handleCopy(convertedText, option.label)}
                        className={cn(
                          "p-2 rounded-lg transition-all duration-200",
                          copiedCase === option.label
                            ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {copiedCase === option.label ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        )}
                      </motion.button>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {option.description}
                  </p>
                  
                  <div className="min-h-[80px] p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className={cn(
                      "text-sm font-mono leading-relaxed break-words",
                      isConverted 
                        ? "text-gray-900 dark:text-gray-100" 
                        : "text-gray-500 dark:text-gray-500 italic"
                    )}>
                      {convertedText || "No text to convert"}
                    </p>
                  </div>
                  
                  {!isConverted && (
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
                      Example output
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          {text && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setText('')}
                  className="btn-ghost text-sm"
                >
                  Clear Text
                </button>
                <button
                  onClick={() => handleCopy(text, 'original')}
                  className="btn-ghost text-sm"
                >
                  Copy Original
                </button>
                <button
                  onClick={() => setText(text.split('').reverse().join(''))}
                  className="btn-ghost text-sm"
                >
                  Reverse Text
                </button>
                <button
                  onClick={() => setText(text.trim().split(/\s+/).filter(Boolean).join(' '))}
                  className="btn-ghost text-sm"
                >
                  Remove Extra Spaces
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 