import React, { useState } from 'react';
import ToolCard from './ToolCard';

export default function GrammarChecker() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/grammar/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.success) {
        const parsedResult = typeof data.result === 'string' 
          ? JSON.parse(data.result) 
          : data.result;

        setResult(parsedResult);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({
        error: 'Failed to check grammar. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    if (result.error) {
      return (
        <div className="text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          {result.error}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {result.corrections?.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              Grammar Corrections
            </h4>
            <ul className="space-y-2">
              {result.corrections.map((correction, index) => (
                <li key={index} className="flex items-start p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <span className="flex-shrink-0 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{correction}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.suggestions?.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Style Suggestions
            </h4>
            <ul className="space-y-2">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span className="flex-shrink-0 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.spelling?.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
              Spelling Errors
            </h4>
            <ul className="space-y-2">
              {result.spelling.map((error, index) => (
                <li key={index} className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <span className="flex-shrink-0 w-5 h-5 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.improved_text && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Improved Text
            </h4>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                {result.improved_text}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ToolCard
      title="Grammar Checker"
      description="Check your text for grammar, spelling, and style improvements using advanced AI analysis."
      inputPlaceholder="Enter your text here to check for grammar, spelling, and style issues..."
      onSubmit={handleSubmit}
      loading={loading}
      result={renderResult()}
      inputValue={text}
      onInputChange={(e) => setText(e.target.value)}
      actionText="Check Grammar"
    />
  );
} 