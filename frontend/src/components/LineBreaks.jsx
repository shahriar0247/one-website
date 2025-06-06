import React, { useState } from 'react';
import ToolCard from './ToolCard';

export default function LineBreaks() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/line-breaks/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.result);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult({
        error: 'Failed to process text. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const addLineBreaks = () => {
    if (!text.trim()) return;
    
    // Add line breaks after periods, question marks, and exclamation marks
    const processedText = text
      .replace(/([.!?])\s+/g, '$1\n')
      .replace(/([.!?])([A-Z])/g, '$1\n$2');
    
    setResult({ processed_text: processedText });
  };

  const removeLineBreaks = () => {
    if (!text.trim()) return;
    
    // Remove line breaks and normalize spaces
    const processedText = text
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    setResult({ processed_text: processedText });
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
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Processed Text
          </h4>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <pre className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap font-sans">
              {result.processed_text}
            </pre>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            Original: {text.split('\n').length} lines
          </span>
          <span>
            Processed: {result.processed_text.split('\n').length} lines
          </span>
        </div>
      </div>
    );
  };

  return (
    <ToolCard
      title="Line Breaks"
      description="Add or remove line breaks from your text to format it properly."
      inputPlaceholder="Enter text to add or remove line breaks..."
      onSubmit={handleSubmit}
      loading={loading}
      result={renderResult()}
      inputValue={text}
      onInputChange={(e) => setText(e.target.value)}
      actionText="Process Text"
    >
      {/* Custom action buttons */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={addLineBreaks}
            disabled={!text.trim()}
            className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <div className="font-medium">Add Line Breaks</div>
              <div className="text-sm opacity-75">Break sentences into new lines</div>
            </div>
          </button>
          
          <button
            onClick={removeLineBreaks}
            disabled={!text.trim()}
            className="w-full px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <div className="font-medium">Remove Line Breaks</div>
              <div className="text-sm opacity-75">Join lines into paragraphs</div>
            </div>
          </button>
        </div>
      </div>
    </ToolCard>
  );
} 