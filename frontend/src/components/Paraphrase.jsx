import React, { useState } from 'react';
import ToolCard from './ToolCard';

export default function Paraphrase() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/paraphrase', {
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
        error: 'Failed to paraphrase text. Please try again.',
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
      <div className="space-y-4">
        {result.paraphrased_text && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Paraphrased Text
            </h4>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed whitespace-pre-wrap">
                {result.paraphrased_text}
              </p>
            </div>
          </div>
            )}

        {result.alternatives && result.alternatives.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Alternative Versions
            </h4>
            <div className="space-y-3">
              {result.alternatives.map((alternative, index) => (
                <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-sm text-gray-900 dark:text-gray-100 leading-relaxed">
                      {alternative}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <ToolCard
      title="Paraphraser"
      description="Rewrite your text while preserving the original meaning with AI-powered paraphrasing."
      inputPlaceholder="Enter the text you want to paraphrase..."
      onSubmit={handleSubmit}
      loading={loading}
      result={renderResult()}
      inputValue={text}
      onInputChange={(e) => setText(e.target.value)}
      actionText="Paraphrase Text"
    />
  );
} 