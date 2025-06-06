import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPage from './ui/ToolPage';
import { cn } from '../utils/cn';
import {
  DocumentTextIcon,
  ClipboardIcon,
  CheckIcon,
  ArrowPathIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const CASE_TYPES = [
  {
    id: 'lowercase',
    name: 'lowercase',
    description: 'convert everything to lowercase',
    example: 'hello world',
    icon: '🔽',
  },
  {
    id: 'uppercase',
    name: 'UPPERCASE',
    description: 'CONVERT EVERYTHING TO UPPERCASE',
    example: 'HELLO WORLD',
    icon: '🔼',
  },
  {
    id: 'title',
    name: 'Title Case',
    description: 'Convert To Title Case',
    example: 'Hello World',
    icon: '🎩',
  },
  {
    id: 'sentence',
    name: 'Sentence case',
    description: 'Convert to sentence case',
    example: 'Hello world',
    icon: '📝',
  },
  {
    id: 'camel',
    name: 'camelCase',
    description: 'convertToCamelCase',
    example: 'helloWorld',
    icon: '🐪',
  },
  {
    id: 'pascal',
    name: 'PascalCase',
    description: 'ConvertToPascalCase',
    example: 'HelloWorld',
    icon: '🏛️',
  },
  {
    id: 'snake',
    name: 'snake_case',
    description: 'convert_to_snake_case',
    example: 'hello_world',
    icon: '🐍',
  },
  {
    id: 'kebab',
    name: 'kebab-case',
    description: 'convert-to-kebab-case',
    example: 'hello-world',
    icon: '🍢',
  },
  {
    id: 'constant',
    name: 'CONSTANT_CASE',
    description: 'CONVERT_TO_CONSTANT_CASE',
    example: 'HELLO_WORLD',
    icon: '🏗️',
  },
  {
    id: 'dot',
    name: 'dot.case',
    description: 'convert.to.dot.case',
    example: 'hello.world',
    icon: '⚪',
  },
  {
    id: 'alternating',
    name: 'aLtErNaTiNg CaSe',
    description: 'cOnVeRt To AlTeRnAtInG cAsE',
    example: 'hElLo WoRlD',
    icon: '🎭',
  },
  {
    id: 'inverse',
    name: 'iNVERSE cASE',
    description: 'iNVERT cASE oF eVERY cHARACTER',
    example: 'hELLO wORLD',
    icon: '🔄',
  },
];

export default function TextCaseConverter() {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState({});
  const [copied, setCopied] = useState('');
  const [stats, setStats] = useState({});

  const convertText = (text, caseType) => {
    if (!text) return '';

    switch (caseType) {
      case 'lowercase':
        return text.toLowerCase();
        
      case 'uppercase':
        return text.toUpperCase();
        
      case 'title':
        return text.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        
      case 'sentence':
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        
      case 'camel':
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
          )
          .replace(/\s+/g, '');
          
      case 'pascal':
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '');
          
      case 'snake':
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('_');
          
      case 'kebab':
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('-');
          
      case 'constant':
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toUpperCase())
          .join('_');
          
      case 'dot':
        return text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map(word => word.toLowerCase())
          .join('.');
          
      case 'alternating':
        return text
          .split('')
          .map((char, index) =>
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
          
      case 'inverse':
        return text
          .split('')
          .map(char =>
            char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()
          )
          .join('');
          
      default:
        return text;
    }
  };

  const calculateStats = (text) => {
    if (!text) return {};
    
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: text.trim().split(/\s+/).filter(word => word.length > 0).length,
      sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
      paragraphs: text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
      lines: text.split('\n').length,
    };
  };

  useEffect(() => {
    if (inputText) {
      const newResults = {};
      CASE_TYPES.forEach(caseType => {
        newResults[caseType.id] = convertText(inputText, caseType.id);
      });
      setResults(newResults);
      setStats(calculateStats(inputText));
    } else {
      setResults({});
      setStats({});
    }
  }, [inputText]);

  const copyToClipboard = async (text, caseType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(caseType);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearText = () => {
    setInputText('');
    setResults({});
    setStats({});
  };

  return (
    <ToolPage
      title="Text Case Converter"
      description="Convert text between different cases like uppercase, lowercase, title case, camelCase, and more."
    >
      <div className="space-y-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Input Text
            </h3>
            {inputText && (
              <button
                onClick={clearText}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Clear
              </button>
            )}
          </div>
          
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-40 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />

          {/* Stats */}
          {Object.keys(stats).length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">{stats.characters}</p>
                <p className="text-xs text-gray-500">Characters</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">{stats.charactersNoSpaces}</p>
                <p className="text-xs text-gray-500">No Spaces</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-500">{stats.words}</p>
                <p className="text-xs text-gray-500">Words</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-500">{stats.sentences}</p>
                <p className="text-xs text-gray-500">Sentences</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-pink-500">{stats.paragraphs}</p>
                <p className="text-xs text-gray-500">Paragraphs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-500">{stats.lines}</p>
                <p className="text-xs text-gray-500">Lines</p>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        {Object.keys(results).length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CASE_TYPES.map((caseType) => (
              <motion.div
                key={caseType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: CASE_TYPES.indexOf(caseType) * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{caseType.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {caseType.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {caseType.description}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => copyToClipboard(results[caseType.id], caseType.id)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      copied === caseType.id
                        ? "text-green-500"
                        : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    )}
                  >
                    {copied === caseType.id ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <ClipboardIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 min-h-[80px] flex items-center">
                  <p className="text-sm text-gray-900 dark:text-white break-all">
                    {results[caseType.id] || caseType.example}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Features Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <SparklesIcon className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Features & Use Cases
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Programming & Development
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Convert variable names to different conventions</li>
                <li>• Format API endpoint names</li>
                <li>• Generate consistent naming patterns</li>
                <li>• Convert database column names</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Content & Writing
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Format headings and titles</li>
                <li>• Convert text for different platforms</li>
                <li>• Create consistent capitalization</li>
                <li>• Fix text formatting issues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  );
} 